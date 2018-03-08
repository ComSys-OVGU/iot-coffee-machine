import debug from 'debug'
import { parse } from '../parser'

const log = debug('lib:delonghi:protocol')
const onDataListeners = []

export class DelonghiProtocol {
  constructor (transport) {
    this.transport = transport

    this.transport.onData(async (data) => {
      if (onDataListeners.length == 0) {
        // no one is interested in the data, so don't bother parsing it
        return
      }
      try {
        const parsed = parse(data)
        if (!parsed) {
          log(`got unparsable data: ${data}`)
          return
        }
        const {
          'LCD:RX': lcdRx,
          'PB:RX': pbRx
        } = parsed
        const decoded = {
          lcdRx: await this.protocol.decode(lcdRx, 'lcd'),
          pbRx: await this.protocol.decode(pbRx, 'pb')
        }

        log(`got data! ${JSON.stringify(parsed)}`)
        // remove all listeners and supply them with the current parsed data
        onDataListeners.splice(0).forEach((listener) => listener({ decoded, parsed }))
      } catch (ex) {
        log(`err: ${ex}`)
      }
    })
  }

  getPacketLen () { 
    const {
      types: {
        lcd: {
          typeLen
        }
      }
    } = this.protocol
    return typeLen / 8 
  }

  async getCapabilities () {
    return {
      beverages: [
        { name: 'one_short_coffee' },
        { name: 'two_short_coffees' },
        { name: 'one_long_coffee' },
        { name: 'two_long_coffees' },
        { name: 'hot_water' }
      ],
      tastes: [
        { name: 'extra_mild' },
        { name: 'mild' },
        { name: 'standard' },
        { name: 'strong' },
        { name: 'extra_strong' },
        { name: 'pre_ground' }
      ],
      sensors: [
        { name: 'grounds_container' },
        { name: 'door' },
        { name: 'water_tank' },
        { name: 'energy_save' },
        { name: 'beans_empty' }
      ]
    }
  }

  async brewBeverage (beverage, taste) {
    log(`brewing ${beverage} @${taste}`)

    // first, check if ready
    const readyState = await this.getIsReady()
    if (!readyState.ready) {
      log('not yet ready, aborting')
      return {
        success: false,
        msg: 'Not yet ready',
        readyState
      }
    }

    // then check if any error condition is true
    if (await this.getIsError()) {
      log('Error condition, aborting')
      return {
        success: false,
        msg: 'Error condition exists'
      }
    }

    if (this.isBrewing) {
      return {
        success: false,
        msg: 'Already brewing'
      }
    }
    this.isBrewing = true

    try {
      if(taste) {
        // set the taste
        await this.setTaste(taste)
      }

      // start brewing
      await this.pressButton(beverage)

      return {
        success: true
      }
    } catch (ex) {
      return {
        success: false,
        msg: ex
      }
    } finally {
      this.isBrewing = false
    }
  }

  async setTaste (taste) {
    const tasteToSet = this.protocol.enums.grind_mode[taste] && parseInt(this.protocol.enums.grind_mode[taste], 10)
    log(`Setting taste ${taste} ${JSON.stringify(tasteToSet)}`)

    let currentState
    let maxTries = 15 // try at least twice for each possible taste
    let success = false
    while (maxTries-- > 0) {
      currentState = await this.getCurrentState()
      if (currentState.decoded.pbRx.grind_mode == tasteToSet) {
        success = true
        break
      } else {
        // try changing the brewmode
        await this.pressButton('ok')
        continue
      }
    }

    if (!success) {
      return {
        success,
        msg: 'cannot change to requested taste'
      }
    }

    return {
      success: true
    }
  }
  async orderBeverage (beverage) {}

  getSensors (validValue) {
    return []
  }

  async getIsReady () {
    const {
      decoded: {
        pbRx,
        pbRx: {
          mode
        }
      }
    } = await this.getCurrentState()

    const sensorValues = [
      ...this.getSensors(false).map((name) => ({name, value: pbRx[`sensor_${name}`], valid: pbRx[`sensor_${name}`] === 0})),
      ...this.getSensors(true).map((name) => ({name, value: pbRx[`sensor_${name}`], valid: pbRx[`sensor_${name}`] === 1}))
    ]

    const invalidSensorValues = sensorValues.filter((val) => !val.valid)
    
    return {
      ready: (mode == this.protocol.enums.pb_mode.ready) && invalidSensorValues.length === 0,
      invalidSensorValues,
      mode
    }
  }

  async getIsError () {
    return false
  }

  async sendLCDFilters ({and, or}) {
    this.sendSerial(`b${and}t6b${or}t7`)
  }

  async sendSerial (cmd) {
    log(`Sending via Serial: '${cmd}'`)

    this.transport.sendData(cmd)
  }

  async wait (ms) {
    log(`Waiting ${ms}ms`)
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async getCurrentState () {
    return new Promise(async (resolve, reject) => {
      // reject after 10s if not successfully resolved
      const timeout = setTimeout(() => {
        log('timeout while waiting for serial data')
        reject()
      }, 10*1000)

      onDataListeners.push(({parsed, decoded, decoded: { pbRx }}) => {
        log(`pbRx: ${JSON.stringify(pbRx)}`)
        // resolve w/ parsed data
        clearTimeout(timeout)
        resolve({ parsed, decoded })
      })

      // poll the machine
      await this.sendSerial('p')
    })
  }

  async pressButton (button) {
    // first, generate filters
    const emptyFilters = {
      and: 'FF'.repeat(this.getPacketLen()),
      or: '00'.repeat(this.getPacketLen())
    }

    const pkgs = {
      and: await this.protocol.decode(emptyFilters.and, 'lcd'),
      or: await this.protocol.decode(emptyFilters.or, 'lcd')
    }

    // set the specified button
    pkgs.or['buttons_' + button] = 1

    // specify one pressed button
    pkgs.or['last_byte_cnt_buttons'] = 1
    pkgs.and['last_byte_cnt_buttons'] = 1
    
    const outFilters = {
      and: this.protocol.encode(pkgs.and, 'lcd'),
      or: this.protocol.encode(pkgs.or, 'lcd')
    }

    log(`Filters out: ${JSON.stringify(outFilters)}`)

    const btn_delay = 100
    try {
      await this.sendLCDFilters(outFilters)
      await this.wait(btn_delay)
      await this.sendLCDFilters(emptyFilters)
      await this.wait(btn_delay)
    } catch (ex) {
      return {
        success: false,
        msg: ex
      }
    }

    return {
      success: true
    }
  }

  async reset () {
    await this.sendSerial('r')
  }
}

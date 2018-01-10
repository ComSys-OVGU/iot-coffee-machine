import {
  computed,
  observable,
  observe,
  action,
  reaction,
  runInAction,
  extendObservable,
  useStrict
} from 'mobx'

useStrict(true)

import remotedev from 'mobx-remotedev'
import { buffers, overwriteBuffers } from './buffers'

const filterObj = (obj, predicate) =>
  Object.assign({}, ...obj.entries()
    .filter(predicate)
    .map(([key, value]) => ({ [key]: value || 0 })))

const types = ['lcd', 'pb']

@remotedev
class DelonghiState {
  filters = {
    lcd: {},
    pb: {}
  }

  getInitialPackets = async ({encode, decode, PACKET_LEN}) => {
    const empty = '00'.repeat(PACKET_LEN)
    const full = 'FF'.repeat(PACKET_LEN)

    const packets = {}
    for (const type of types) {
      try {
        packets[type] = {
          empty: await decode(empty, type),
          full: await decode(full, type)
        }
      } catch (ex) {
        console.error(ex)
      }
    }
    runInAction('set initial packets', () => {
      // console.log('setting initial packets', packets)
      for (const type of types) {
        Object.assign(this.filters[type], packets[type])
      }
    })
  }

  @action.bound
  setFilterEnabled (type, field, enabled) {
    this.filters[type].enabled.set(field, enabled)
  }

  @action.bound
  setFilterInput (type, field, value) {
    this.filters[type].inputs.set(field, value)
  }

  pressButton (buttonName, duration = 1000) {
    this.setButtonEnabled(buttonName, true)

    setTimeout(() => {
      this.setButtonEnabled(buttonName, false)
    }, duration)
  }

  @action.bound
  setButtonEnabled (buttonName, enabled) {
    this.filters.lcd.inputs.set(buttonName, enabled)
    this.filters.lcd.enabled.set(buttonName, enabled)

    // if no more button is active, then disable the counter
    const cnt = this.filters.lcd.obj.last_byte_cnt_buttons || 0
    const enableCounter = enabled || cnt > 0
    this.filters.lcd.enabled.set('last_byte_cnt_buttons', enableCounter)
  }

  constructor ({protocol: {encode, decode}, PACKET_LEN, transport}) {
    this.encode = encode
    this.decode = decode

    const decodeHex = async (hex, type, target) => {
      try {
        const obj = await decode(hex, type)

        runInAction(`apply decoded hex: ${hex} ${type} ${target}`, () => {
          this[target].replace(obj)
        })
      } catch (ex) {
        console.error(ex)
      }
    }

    // apply all buffers into the state
    buffers.forEach(({name, type, uartBuffer = ''}) => {
      extendObservable(this, {
        // each buffer is held as the *decoded* object
        [name]: observable.map(),
        // but we also support accessing (r/w!) the hex-variant
        [name + '_hex']: computed(
          () => encode(this[name].toJS(), type),
          {
            name: name,
            setter: (val) => decodeHex(val, type, name)
          }
        )
      })

      // only send uartBuffers to the uart
      if (uartBuffer) {
        reaction(
          () => ({
            hex: this[name + '_hex']
          }),
          ({hex}) => {
            const updateCmd = `b${hex}t${uartBuffer}`
            console.log(`Updating ${name} with new val: ${updateCmd}`)
            transport.sendData(updateCmd)
          }, {
            name: `${name}-send-reaction`
          }
        )
      }
    })

    types.forEach((type) => {
      extendObservable(this.filters[type], {
        empty: {},
        full: {},

        inputs: observable.map(),
        enabled: observable.map(),

        get obj () {
          const convert = (val) => typeof val === 'undefined' ? 0 : typeof val === 'boolean' ? Number(val) : parseInt(val, 16)

          const convertedEnabledValues = Object.assign({}, ...this.enabled.entries().map(
            ([key, filterEnabled]) => filterEnabled ? { [key]: (convert(this.inputs.get(key))) } : {}
          ))

          // set the number of buttons by counting active buttons
          if (this.enabled.get('last_byte_cnt_buttons')) {
            convertedEnabledValues['last_byte_cnt_buttons'] = Object.entries(convertedEnabledValues).reduce(
              (sum, [key, entry]) => sum + (key.startsWith('buttons_') && entry === 1 ? 1 : 0)
            , 0)
          }

          return convertedEnabledValues
        },
        get and () {
          return {...this.full, ...this.obj}
        },
        get or () {
          return {...this.empty, ...this.obj}
        },
        get andHex () {
          console.log('encoding')
          return encode(this.and, type)
        },
        get orHex () {
          console.log('encoding')
          return encode(this.or, type)
        }
      })

      const andBuffer = overwriteBuffers.find(({type: bufferType, use}) => type === bufferType && use === 'and')
      const orBuffer = overwriteBuffers.find(({type: bufferType, use}) => type === bufferType && use === 'or')

      reaction(
        () => ({
          and: this.filters[type].and,
          or: this.filters[type].or
        }),
        ({and, or}) => {
          this[andBuffer.name].replace(and)
          this[orBuffer.name].replace(or)
        }, {
          name: `${type}-copy-reaction`
        }
      )
    })

    this.getInitialPackets({encode, decode, PACKET_LEN})
  }
}

export { DelonghiState }

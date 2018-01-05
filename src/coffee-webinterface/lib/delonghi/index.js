import equal from 'fast-deep-equal'

import {
  PREGROUND
} from './const/grind-modes'

import { Protocol } from './protocol'
import { parse } from './parser'
import { DelonghiState } from './state'

String.prototype.setAt = function (index, replacement) {
  return this.substr(0, index) + replacement + this.substr(index + replacement.length)
}
const flatten = (list) => list.reduce(
  (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
)
const flattenField = (field) => field.fields ? [field, field.fields.map(flattenField)] : [field]

const PACKET_LEN = 9

class Delonghi {
  constructor (transport = (() => { throw new Error('transport is required') })(), ksy = (() => { throw new Error('schema is required') })()) {
    this.transport = transport
    this.protocol = Protocol('delonghi_v1', ksy)

    const {
      types,
      types: {
        lcd
      }
    } = this.protocol
    this.PACKET_LEN = lcd.typeLen / 8
    this.fields = Object.keys(types).reduce((acc, typeName) => ({...acc, [typeName]: flatten(types[typeName].fields.map(flattenField))}), {})
    this.st = new DelonghiState(this)

    this.empty = {}
    this.full = {}
    this.state = {
      lcd: {},
      pb: {},
      buffers: {
        lcd: {
          tx: '',
          rx: ''
        },
        pb: {
          tx: '',
          rx: ''
        }
      },
      filters: {
        lcd: {
          andHex: 'FF'.repeat(PACKET_LEN),
          orHex: '00'.repeat(PACKET_LEN)
        },
        pb: {
          andHex: 'FF'.repeat(PACKET_LEN),
          orHex: '00'.repeat(PACKET_LEN)
        }
      }
    }
    this.setInitialPackets()

    this.transport.onData((data) => {
      this.parseData(data)
    })
  }

  parseData (data) {
    const packets = parse(data)

    if (packets) {
      this.setState(({ buffers = {}, ...rest }) => {
        const converted = Object.keys(packets)
          .map((key) => key.toLowerCase())
          .map((key) => key.split(':'))
          .filter(([type, buffer]) => buffers[type] && typeof buffers[type][buffer] !== 'undefined')
          .reduce((obj, [type, buffer]) => ({
            ...obj,
            [type]: {
              ...obj[type],
              [buffer]: packets[`${type.toUpperCase()}:${buffer.toUpperCase()}`]
            }
          }), {})

        // console.log('GOT PACKETS', packets, converted, this.state)

        return {
          ...rest,
          buffers: converted
        }
      })
    }
  }

  applyFilter (obj, type, cb) {
    this.setState(({
      filters,
      ...rest
    }) => ({
      ...rest,
      filters: {
        ...filters,
        [type]: this.generateFilter(obj, type)
      }
    }), (newState, changed) => {
      if (changed) {
        this.sendFiltersToDevice(type)
      }
      cb && cb()
    })
  }

  sendFiltersToDevice (type) {
    // NOTE: these are in reverse; because we need to send them to the other device
    const typeToBuffer = {
      pb: {
        and: 1,
        or: 2
      },
      lcd: {
        and: 6,
        or: 7
      }
    }

    // send filters to the device
    this.sendData(`b${this.state.filters[type].andHex}t${typeToBuffer[type].and}`)
    this.sendData(`b${this.state.filters[type].orHex}t${typeToBuffer[type].or}`)
  }

  generateFilter (obj, type) {
    // only set the props we want
    // const setObject = Object.assign({}, ...Object.keys(obj).filter((key) => !!obj['_set_' + key]).map(key => ({ [key]: obj[key] })))

    const or = { ...this.empty[type], ...obj }
    const and = { ...this.full[type], ...obj }

    return {
      and,
      andHex: this.protocol.encode(and, type),
      or,
      orHex: this.protocol.encode(or, type)
    }
  }

  generateFilters () {
    // only set the props we want
    // const setLcd = Object.assign({}, ...Object.keys(lcd).filter((key) => !!lcd['_set_' + key]).map(key => ({ [key]: lcd[key] })))

    this.setState(({lcd, pb, ...rest}) => ({
      ...rest,
      filters: {
        lcd: this.generateFilter(lcd, 'lcd'),
        pb: this.generateFilter(pb, 'pb')
      }
    }))
  }

  setState = async (cbOrNewState, done) => {
    const oldState = this.state

    let newState
    if (typeof cbOrNewState === 'function') {
      newState = cbOrNewState(oldState)
      if (newState instanceof Promise) {
        newState = await newState
      }
    } else {
      newState = cbOrNewState
    }

    const changed = !equal(newState, oldState)
    if (typeof newState !== 'undefined' && changed) {
      this.state = newState

      // run cb
      console.log('State changed, new: ', newState)
    }

    done && done(newState, changed)
  }

  async setInitialPackets () {
    this.empty = {
      lcd: await this.protocol.decode('00'.repeat(this.PACKET_LEN), 'lcd'),
      pb: await this.protocol.decode('00'.repeat(this.PACKET_LEN), 'pb')
    }
    this.full = {
      lcd: await this.protocol.decode('FF'.repeat(this.PACKET_LEN), 'lcd'),
      pb: await this.protocol.decode('FF'.repeat(this.PACKET_LEN), 'pb')
    }

    this.generateFilters(this.state)
  }

  onData = (...args) => {
    return this.transport.onData(...args)
  }
  offData = (...args) => {
    return this.transport.offData(...args)
  }
  sendData = (...args) => {
    return this.transport.sendData(...args)
  }

  resetFilters = () => {
    // reset all AND and OR filters
    this.setState(({...rest}) => ({
      ...rest,
      filters: {
        lcd: this.generateFilter({}, 'lcd'),
        pb: this.generateFilter({}, 'pb')
      }
    }))

    this.transport.sendData(`T0T1T2T5T6T7`)
  }

  setFilters = (type, {and, or}) => {
    this.transport.sendData(`b${and}t${type + 1}`)
    this.transport.sendData(`b${or}t${type + 2}`)
  }

  setGrindMode = (mode) => {
    let filters
    switch (mode) {
      case PREGROUND:
        filters = this.state.filters.lcd
        filters.and = filters.and.setAt(6, '2').setAt(7, '8')
        filters.or = filters.or.setAt(6, '2').setAt(7, '8')

        this.setFilters(0, filters)
        break
      default:
        filters = this.state.filters.lcd
        filters.and = filters.and.setAt(6, '0').setAt(7, '0')
        filters.or = filters.or.setAt(6, '0').setAt(7, '0')

        this.setFilters(0, filters)
        break
    }
  }

  disableEntkalken = () => {
    const filters = this.state.filters.lcd
    filters.and = 'FF'.repeat(PACKET_LEN)
    filters.or = '00'.repeat(PACKET_LEN)

    filters.and = filters.and.setAt(13, '0')

    this.setFilters(0, filters)
  }
}

export * from './transports/browser'
export default Delonghi

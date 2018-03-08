import debug from 'debug'
import packet from 'packet'

import { resolveTypes } from '../kaitai-packet-converter'

const log = debug('lib:delonghi:protocol')

export const Protocol = (PROTOCOL, KSY) => {
  const types = resolveTypes(KSY.types)

  const parser = packet.createParser()
  const serializer = parser.createSerializer()
  // register all generated types
  Object.keys(types).forEach((type) => {
    log(`registering parser for ${PROTOCOL}_${type}: ${types[type].mapped}`)
    parser.packet(`${PROTOCOL}_${type}`, types[type].mapped)
  })

  const decode = async (hexPacket, type = hexPacket.substring(0, 2) === 'B0' ? 'lcd' : 'pb') => {
    return new Promise((resolve, reject) => {
      parser.extract(`${PROTOCOL}_${type}`, resolve)
      parser.parse(Buffer.from(hexPacket, 'hex'))
    })
  }
  const encode = (objPacket, type = objPacket.packet_type === 0xB0 ? 'lcd' : 'pb') => {
    serializer.serialize(`${PROTOCOL}_${type}`, objPacket)
    // Write into new buffer (size big enough)
    const buf = Buffer.alloc(types[type].typeLen / 8, 0)
    serializer.write(buf)

    return buf.toString('hex').toUpperCase()
  }

  return {
    types,
    enums: Object.assign({}, ...Object.entries(KSY.enums).map(([enumName,enumValues]) => ({ [enumName]: Object.assign({...enumValues}, ...Object.entries(enumValues).map(([a,b]) => ({ [b]: a }))) }))),
    parser,
    serializer,
    encode,
    decode
  }
}

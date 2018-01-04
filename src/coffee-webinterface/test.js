import yaml from 'js-yaml'
import fs from 'fs'

import { Protocol } from './lib/delonghi/protocol'

const KSY = yaml.safeLoad(fs.readFileSync(`./static/delonghi_v1.ksy`, 'utf8'))
const { encode, decode } = Protocol('delonghi_v1', KSY)

const run = async (pkg) => {
  const decodedPacket = await decode(pkg)
  const encodedPacket = encode(decodedPacket)

  console.log('got: ', encodedPacket, encodedPacket === pkg, JSON.stringify(decodedPacket, null, 2))
}
const run2 = async (pkg) => {
  const decodedPacket = await decode(pkg, 'pb')

  decodedPacket.buttons_ok = 1
  decodedPacket.body_6_x05 = 1
  decodedPacket.checksum = 0xFF

  const encodedPacket = encode(decodedPacket, 'pb')

  console.log('r2 got: ', encodedPacket, encodedPacket === pkg, JSON.stringify(decodedPacket, null, 2))
}

run2('000000000000000000')
// run('B00020060E301280FB')
// run('0B0700280F200400C2')

const checksumOK = require('./checksum').checksumOK
const packetRegex = /0B.{20}/

// the status is encoded in hex in these bits:
// ..ss..............
const STATUS_START = 2
const STATUS_LEN = 2
const STATUS = {
  0x00: 'OFF',
  0x01: 'HEATING',
  0x07: 'READY',
  0x20: 'LCD_TESTMODE',
  0x21: 'LOAD_TESTMODE'
}
const parseStatusFromHex = (input) => {
  const statusInt = parseInt(input.substr(STATUS_START, STATUS_LEN), 16)

  return `${STATUS[statusInt] || 'UNKNOWN'}`
}

// the mahlgrad is encoded in hex in these bits:
// ......mm..........
const MG_START = 6
const MG_LEN = 2
const MG = {
  0x00: 'SEHR_MILD',
  0x08: 'MILD',
  0x10: 'NORMAL',
  0x18: 'KRAFTIG',
  0x20: 'SEHR_KRAFTIG',
  0x28: 'VORGEMAHLEN'
}
const parseMGFromHex = (input) => {
  const status = parseStatusFromHex(input)
  const mgInt = status == STATUS[0x07] && parseInt(input.substr(MG_START, MG_LEN), 16)

  return `${MG[mgInt] || 'UNKNOWN'}`
}

const maskKnownBits = (input) => {
    // generate displayBits (i.e. mosi but with only unknown bits)
  let displayBits = input.toUpperCase().split('') // make uppercase char array

    // we know the start of each frame
  displayBits[0] = '_'
  displayBits[1] = '_'

    // we know the btns
    // displayBits[2] = '_'
    // displayBits[3] = '_'

  if (checksumOK(input)) {
        // we know the checksum and it is valid anyway
    displayBits[16] = '√'
    displayBits[17] = '√'
  }
  displayBits = displayBits.join('')

  return displayBits
}

module.exports = (input) => {
    // input must be in the form of '0B0700280F200400C2'
  if (!packetRegex.test(input)) {
    const err = 'invalid format'
    return {err}
  }

    // extract information
  const status = parseStatusFromHex(input)
  const mg = parseMGFromHex(input)

  const displayBits = maskKnownBits(input)

  return {
    status,
    mg,
    displayBits
  }
}

const checksumOK = require('./checksum').checksumOK
const packetRegex = /B0.{16}/

// the time is encoded as hex in these bits:
// ........hhmmss....
const TIME_START = 8
const TIME_LEN = 6
const parseTimeFromHex = (input) => {
  const timeInt = parseInt(input.substr(TIME_START, TIME_LEN), 16)
  const hourInt = (timeInt & 0xFF0000) >> 16
  const minInt = (timeInt & 0x00FF00) >> 8
  const secInt = (timeInt & 0x0000FF)

  return `${hourInt.toString(10).padStart(2, '0')}:${minInt.toString(10).padStart(2, '0')}:${secInt.toString(10).padStart(2, '0')}`
}

// events (currently buttons only) are encoded in hex in these bits:
// ..ABCD............
const BTNS_START = 2
const BTNS_LEN = 4
const BTNS = {
//    0000111122223333
//    AAAABBBBCCCCDDDD
  0b0000000000000001: 'ONE_BIG_COFFEE',
  0b0000000000000010: 'CAPPUCHINO',
  0b0000000000000100: 'LATTE_MACCHIATO',
  0b0000000000001000: 'CAFFEE_LATTE',
  0b0000000000010000: 'TWO_BIG_COFFEES',
    // 0b0000000000100000: 'UNKNOWN_1', // seems to be always set
  0b0000000001000000: 'UNKNOWN_2', // if you see any of these, please fix
  0b0000000010000000: 'UNKNOWN_3', // if you see any of these, please fix
  0b0000000100000000: 'PWR',
  0b0000001000000000: 'POSSIBLY_HIDDEN_BTN', // this is unverified
  0b0000010000000000: 'P',
  0b0000100000000000: 'FLUSH_WATER',
  0b0001000000000000: 'HOT_WATER',
  0b0010000000000000: 'OK',
  0b0100000000000000: 'ONE_SMALL_COFFEE',
  0b1000000000000000: 'TWO_SMALL_COFFEES'
}
const parseEventsFromHex = (input) => {
  const events = []

    // find all button presses
  const btns = parseInt(input.substr(BTNS_START, BTNS_LEN), 16)
  Object.keys(BTNS).forEach((hex) => {
    const btn = BTNS[hex]
        // console.log(`${btn}? : ${btns} & ${hex} = ${btns & hex}`)
    if ((btns & hex) !== 0) {
            // this button was pressed
      events.push(`BTN:${btn}`)
    }
  })

  return events
}

const maskKnownBits = (input) => {
    // generate displayBits (i.e. miso but with only unknown bits)
  let displayBits = input.toUpperCase().split('') // make uppercase char array

    // we know the start of each frame
  displayBits[0] = '_'
  displayBits[1] = '_'

    // we know the btns
    // displayBits[2] = '_'
    // displayBits[3] = '_'

    // we know the time
  displayBits[8] = '_'
  displayBits[9] = '_'
  displayBits[10] = '_'
  displayBits[11] = '_'
  displayBits[12] = '_'
  displayBits[13] = '_'

    // hide alternating pattern
  displayBits[6] = '?'
  displayBits[7] = '?'

  if (checksumOK(input)) {
        // we know the checksum and it is valid anyway
    displayBits[16] = '√'
    displayBits[17] = '√'
  }

  displayBits = displayBits.join('')

  return displayBits
}

module.exports = (input) => {
    // input must be in the form of 'B00020060E301280FB'
  if (!packetRegex.test(input)) {
    const err = 'invalid format'
    return {err}
  }

    // extract information
  const time = parseTimeFromHex(input)
  const events = parseEventsFromHex(input)

  const displayBits = maskKnownBits(input)

  return {
    time,
    events,
    displayBits
  }
}

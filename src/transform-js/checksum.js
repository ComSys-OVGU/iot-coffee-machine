// https://stackoverflow.com/a/17323608/1635864
// The % operator in JavaScript is the remainder operator, not the modulo operator (the main difference being in how negative numbers are treated)
function mod (n, m) {
  return ((n % m) + m) % m
}

const CHECKSUM_OFFSET = 0x55
const checksum = (input) => {
  const bytes = input
        // cut off the last byte
        .slice(0, -2)
        // split into array of 2-char strings
        .split(/(?=(?:..)*$)/)
        // parse into array of numbers
        .map((hex) => parseInt(hex, 16))

  const sum = bytes
        // sum these numbers
        .reduce((el, sum) => {
          return sum + el
        }, CHECKSUM_OFFSET) // but start at CHECKSUM_OFFSET to mitigate DeLonghi's start

    // return sum %% 256
  return mod(sum, 0xFF + 1)
}
const checksumOK = (input) => checksum(input) === parseInt(input.slice(-2), 16)

module.exports = {
  checksum,
  checksumOK
}

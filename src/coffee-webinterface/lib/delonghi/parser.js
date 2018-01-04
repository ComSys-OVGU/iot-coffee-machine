const singlePacketRegEx = String.raw`(?:[\s->]+([^\=]+)\=([^ ]+))`
const regs = {
  packets: new RegExp(String.raw`^\[Delonghi\]${singlePacketRegEx.repeat(6)}$`)
}

const unzip = (arr) => arr.reduce((obj, val, i) => {
  if (i % 2 !== 0) {
    return {
      ...obj,
      [arr[i - 1]]: val
    }
  }
  return obj
}, {})

const parse = (data) => {
  if (regs.packets.test(data)) {
    const [, ...extracted] = regs.packets.exec(data)
    const packet = unzip(extracted)
    // console.log(`found packet`, packet)

    return packet
  }
}

export { parse }

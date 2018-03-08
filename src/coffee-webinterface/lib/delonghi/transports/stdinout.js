import debug from 'debug'
import readline from 'readline'

const log = debug('lib:delonghi:transports:stdinout')

export class DelonghiStdInOut {
  constructor () {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    })

    this.rl.on('line', (line) => {
      log(`rxdata: '${line}'`)
      this.onDataListener && this.onDataListener(line)
    })
  }

  onData (cb, ...args) {
    this.onDataListener = cb
  }

  sendData (data, ...args) {
    log(`txdata: '${data}'`)
  }
}
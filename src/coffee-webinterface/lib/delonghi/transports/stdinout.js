import debug from 'debug'
import readline from 'readline'
import { DelonghiTransport } from './transport'

const log = debug('lib:delonghi:transports:stdinout')

export class DelonghiStdInOut extends DelonghiTransport {
  constructor () {
    super()
    this.lastLine = '[Delonghi] LCD:RX=B040208E0A380981BF -> PB:TX=B040208E0A380981BF  PB:RX=0B0700000701040073 -> LCD:TX=0B0700000701040073 TS=192325'
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    })

    this.rl.on('line', (line) => {
      if(line === '') {
        this.onDataListener && this.onDataListener(this.lastLine)
      } else {
        log(`rxdata: '${line}'`)
        this.lastLine = line
      }
    })
  }

  onData (cb, ...args) {
    this.onDataListener = cb
  }

  sendData (data, ...args) {
    log(`txdata: '${data}'`)

    // answer immediately
    if(true) {
      this.onDataListener && this.onDataListener(this.lastLine)
    }
  }

  getIsConnected () {
    return true
  }
}
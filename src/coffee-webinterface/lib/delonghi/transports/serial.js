import debug from 'debug'
import SerialPort from 'serialport'
import fs from 'fs'
import { DelonghiTransport } from './transport'

const log = debug('lib:delonghi:transports:serial')
const Regex = SerialPort.parsers.Regex

class DelonghiSerial extends DelonghiTransport {
  constructor ({port = '/dev/cu.usbserial-AM021CBT', baudRate = 921600}) {
    super()
    this.state = {
      connected: false,
      serialConfig: {
        port,
        baudRate,
        autoOpen: false
      }
    }

    this.setupConnection()
  }

  setupConnection () {
    const {
      port,
      ...config
    } = this.state.serialConfig

    // initialize serial connection with a single byte parser
    this.serialConnection = new SerialPort(port, config)
    this.parser = this.serialConnection.pipe(new Regex({ regex: /[\r\n]+/ }))

    this.parser.on('data', (rawdata) => {
      const data = rawdata.toString('utf8')
      log(`rxdata: '${data}'`)
      this.onDataListener && this.onDataListener(data)
    })

    this.serialConnection.on('open', () => {
      this.state.connected = true
      log(`connected successfully`)
    })

    // error handling
    this.serialConnection.on('error', (err) => {
      console.error(`An error happened on ${port}:`, err)
    })

    this.openPort()
  }

  openPort () {
    const { port } = this.state.serialConfig
    this.serialConnection.open((err) => {
      if (err) {
        log(`Error while opening port:`, err)

        // watch the serial port and reconnect when available
        fs.watchFile(port, (curr, prev) => {
          if (curr.isCharacterDevice() === true && prev.isCharacterDevice() === false) {
            log(`Device appeared, connecting...`)
            fs.unwatchFile(port)

            this.openPort()
          }
        })
      }
    })
  }

  onData (cb, ...args) {
    this.onDataListener = cb
  }

  sendData (data, ...args) {
    log(`txdata: '${data}'`)
    this.serialConnection.write(data, ...args)
  }

  getIsConnected () {
    return this.state.connected
  }
}

export { DelonghiSerial }

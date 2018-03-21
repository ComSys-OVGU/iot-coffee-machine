import io from 'socket.io-client'
import { DelonghiTransport } from './transport'

class DelonghiWebsocket extends DelonghiTransport {
  constructor (address = '') {
    super()
    this.socket = io(address)
  }

  onData (...args) {
    return this.socket.on('data', ...args)
  }
  offData (...args) {
    return this.socket.off('data', ...args)
  }

  sendData (...args) {
    return this.socket.emit('data', ...args)
  }
}

export { DelonghiWebsocket }

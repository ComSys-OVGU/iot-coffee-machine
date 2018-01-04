import io from 'socket.io-client'

class DelonghiWebsocket {
  constructor (address = 'ws://0.0.0.0:3000') {
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

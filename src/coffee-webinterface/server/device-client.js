import Koa from 'koa'
import Router from 'koa-router'
import IO from 'koa-socket'
import cors from '@koa/cors'

import { DelonghiSerial } from '../lib/delonghi/transports/node'
import { DelonghiStdInOut } from '../lib/delonghi/transports/stdinout'

import { DelonghiV1 } from '../lib/delonghi/protocols/delonghi_v1'

const port = parseInt(process.env.PORT, 10) || 3001
const dev = process.env.NODE_ENV !== 'production'
const io = new IO()
const delonghi = new DelonghiSerial('/dev/cu.usbserial-AM021CBT')
// const delonghi = new DelonghiStdInOut()
const delonghiProtocol = new DelonghiV1(delonghi)

const server = new Koa()
const router = new Router()

router.get('/beverages', async ctx => {
  const {
    beverages
  } = await delonghiProtocol.getCapabilities()

  ctx.body = beverages
})

router.get('/currentState', async ctx => {
  ctx.body = {
    ready: await delonghiProtocol.getIsReady(),
    ...(await delonghiProtocol.getCurrentState())
  }
})
router.get('/isReady', async ctx => {
  ctx.body = {
    ready: await delonghiProtocol.getIsReady()
  }
})
router.post('/reset', async ctx => {
  await delonghiProtocol.sendSerial('r')
  ctx.body = {
    reset: true
  }
})
router.post('/fakeOff', async ctx => {
  await delonghiProtocol.sendSerial('b0B00020047010400AEt1t2')
  ctx.body = {
    fakeOff: true
  }
})
router.post('/resetFilters', async ctx => {
  await delonghiProtocol.sendSerial('T1T2')
  ctx.body = {
    resetFilters: true
  }
})
router.post('/taste/:taste', async ctx => {
  const {
    taste
  } = ctx.params

  ctx.body = await delonghiProtocol.setTaste(taste)
})

router.post('/button/:button', async ctx => {
  const {
    button
  } = ctx.params

  ctx.body = await delonghiProtocol.pressButton(button)
})

router.post('/brew/:beverage/:taste?', async ctx => {
  const {
    beverage,
    taste
  } = ctx.params
  try {
    const response = await delonghiProtocol.brewBeverage(beverage, taste)
    ctx.body = response
  } catch (ex) {
    ctx.body = {
      success: false,
      msg: 'error while brewing'
    }
  }
})

// Attach the socket to the application
// io.attach(server)
// server._io.on('connection', (socket) => {
//   // relay socket.io writes to the serial port
//   socket.on('data', (data) => {
//     delonghi.sendData(data)
//   })
// })

// delonghi.onData((data) => {
//   server.io.broadcast('data', data)
// })

server.use(cors())
server.use(router.routes())
server.use(router.allowedMethods())
server.listen(port, (err) => {
  if (err) throw err
  console.log(`> Ready on http://localhost:${port}`)
})

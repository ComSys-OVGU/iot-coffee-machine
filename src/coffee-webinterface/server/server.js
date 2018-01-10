import Koa from 'koa'
import next from 'next'
import Router from 'koa-router'
import IO from 'koa-socket'

import { DelonghiSerial } from '../lib/delonghi/transports/node'

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const io = new IO()
const delonghi = new DelonghiSerial('/dev/cu.usbserial-AM021CBT')

app.prepare().then(() => {
  const server = new Koa()
  const router = new Router()

  router.get('*', async ctx => {
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200
    await next()
  })

  // Attach the socket to the application
  io.attach(server)
  server._io.on('connection', (socket) => {
    // relay socket.io writes to the serial port
    socket.on('data', (data) => {
      delonghi.sendData(data)
    })
  })

  delonghi.onData((data) => {
    server.io.broadcast('data', data)
  })

  server.use(router.routes())
  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})

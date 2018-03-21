import Koa from 'koa'
import next from 'next'
import Router from 'koa-router'
import IO from 'koa-socket'
import cors from '@koa/cors'
import sqlite from 'sqlite'
import bodyparser from 'koa-bodyparser'
import { API } from '../lib/api'

import { DelonghiSerial } from '../lib/delonghi/transports/node'

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const dbPromise = sqlite.open('./database.sqlite', { Promise })

app.prepare().then(() => {
  const server = new Koa()
  const router = new Router()

  router.get('/api/history', async ctx => {
    const db = await dbPromise
    ctx.body = await db.all('SELECT rowid as id, date, type, taste FROM History')
  })

  router.post('/api/order', bodyparser(), async ctx => {
    const {
      type,
      taste
    } = ctx.request.body
    const db = await dbPromise
    const date = (new Date).toISOString()
    await db.all('INSERT INTO History (date, taste, type) VALUES ($date, $taste, $type)', {
      $taste: taste,
      $type: type,
      $date: date
    })
  
    ctx.body = await API.brewBeverage(type, taste)
  })

  router.get('*', async ctx => {
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })


  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200
    await next()
  })

  server.use(cors())
  server.use(router.routes())
  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})

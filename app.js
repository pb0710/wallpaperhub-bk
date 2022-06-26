console.log(`base url: http://localhost:10086`)
import Koa from 'koa'
import cors from '@koa/cors'
import router from './router.js'

const app = new Koa()
app.use(cors()).use(router.routes()).use(router.allowedMethods()).listen(10086)

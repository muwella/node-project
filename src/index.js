import 'colors'
import * as dotenv from 'dotenv'
import express from 'express'
import verify_token from './middlewares/token.js'
import routes from './routes/index.js'
import dbConnection from './database.js'

// 192.168.0.76

dotenv.config()
const app = express()
const port = 6006

app.use(express.json())

// middlewares
app.use(verify_token)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'
  )
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, OPTIONS, PUT, DELETE'
  )
  res.header('Allow', 'GET, POST, PATCH, OPTIONS, PUT, DELETE')
  next()
})

app.use('/', routes)

// middleware verify_token used to be global
// but i needed to not use it on account_router
// so now its used particularly by the routers that need it

// app.use(verify_token)

dbConnection()

// start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`.brightCyan)
})

// LOOKUP joi for schemas
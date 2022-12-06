import 'colors'
import * as dotenv from 'dotenv'
import express from 'express'
import verify_token from './middlewares/token.js'
import routes from './routes/index.js'
import dbConnection from './database.js'


dotenv.config()
const app = express()
const port = 3001

app.use(express.json())
app.use(verify_token)
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
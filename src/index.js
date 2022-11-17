import colors from 'colors'
import express from 'express'
import routes from './routes/index.js'
import { log_error, error_handler } from './middlewares/error.handler.js'
import dbConnection from './database.js'

const app = express()
const port = 3001

app.use(express.json())
app.use('/', routes)
app.use(log_error)
app.use(error_handler)

dbConnection()

// start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`.cyan.bold)
})

// LOOKUP joi for schemas
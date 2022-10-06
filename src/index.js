require('colors')
const express = require('express')
const app = express()

// using routes
app.use('/', require('./routes'))

// WIP database connection
const port = 3000

// start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`.cyan.bold)
})
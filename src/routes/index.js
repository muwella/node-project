const app = require('express')()

app.use('/recipes', require('./recipes'))
app.use('/users', require('./users'))
app.use('/ingredients', require('./ingredients'))
// app.use('/', require('./'))

module.exports = app
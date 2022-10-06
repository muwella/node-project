const express = require('express')

const router = express.Router()

router.get('/:id', (req, res) => {
    const { id } = req.params
  
    // search in DB for ingredient with id
    res.json({
      id
    })
  })

module.exports = router
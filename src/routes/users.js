import express from 'express'

const router = express.Router()

router.get('/:id', (req, res) => {
    const { id } = req.params
  
    // search in DB for user with id
    res.json({
      id, 'papas': 'ranch'
    })
  })

export default router
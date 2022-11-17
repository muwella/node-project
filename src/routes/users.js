import express from 'express'
import UsersService from '../services/users.service.js'

const router = express.Router()
const service = new UsersService()


// endpoints

router.get('/', async (req, res) => {
  try {
    const users = await service.get_users()
    res.status(200).json(users)
  } catch(err) {
    console.error(err)
  }
})


router.get('/:id', (req, res) => {
    const { id } = req.params
  
    // search in DB for user with id
    res.json({
      id, 'papas': 'ranch'
    })
  })

export default router
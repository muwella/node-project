import express from 'express'
import { log_error, error_handler } from '../middlewares/error.handler.js'
import jwt from 'jsonwebtoken'
import UsersService from '../services/users.service.js'

const router = express.Router()
const service = new UsersService()

// endpoints

// PRODUCTION

// WIP send a confirmation mail
// the user has a week to confirm the account or username and email get liberated
// the user cannot create recipes until it is confirmed (WIP waiting confirmation view)
router.post('/new', async (req, res) => {
  try {
    const jwt = await service.create(req.body)

    res.status(201).json({
      message: "User created",
      token: jwt
    })
  } catch(err) {
    log_error(err, req, res)
    error_handler(err, 400, req, res)
  }
})


router.get('/me', async (req, res) => {
  try {
    const user = await service.get_user_me(req.headers.authorization)
    res.status(200).json(user)
  } catch (err) {
    log_error(err, req, res)
    error_handler(err, 404, req, res) 
  }
})


router.patch('/me/update', async (req, res) => {
  const token = jwt.decode(req.headers.authorization)

  try {
    const user = await service.update(token.user_id, req.body)
    res.status(200).json(user)
  } catch(err) {
    log_error(err, req, res)
    error_handler(err, 400, req, res)
  }
})


// delete should deactivate the users' account
// and delete it permanently after 30 days
// should have a Recover account
// WIP delete if user info and TOKEN coincide
router.delete('/me/delete/', async (req, res) => {
  const token = jwt.decode(req.headers.authorization)

  try {
    await service.delete(token.user_id)
    res.status(200).json({ 'message': `User ${token.user_id} deleted` })
  } catch(err) {
    log_error(err, req, res)
    error_handler(err, 400, req, res)
  }
})


// DEVELOPMENT

// WIP get if user info and TOKEN coincide
router.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const user = await service.get_user_by_id(id)
    res.status(200).json(user)
  } catch (err) {
    log_error(err, req, res)
    error_handler(err, 404, req, res)
  }
})


router.get('/', async (req, res) => {
  try {
    const users = await service.get_users()
    
    res.status(200).json(users)
  } catch(err) {
    log_error(err, req, res)
    error_handler(err, 404, req, res)
  }
})


router.put('/updateAll', async (req, res) => {
  try {
    const users = await service.update_all(req.body)
    res.status(200).json(users)
  } catch(err) {
    log_error(err, req, res)
    error_handler(err, 400, req, res)
  }
})


export default router
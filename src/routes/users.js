import express from 'express'
import { log_error, error_handler } from '../middlewares/error.handler.js'
import jwt from 'jsonwebtoken'
import UsersService from '../services/users.service.js'
import verify_token from '../middlewares/token.js'

const router = express.Router()
router.use(verify_token)
const service = new UsersService()

// PRODUCTION

// get self
router.get('/me', async (req, res) => {
  try {
    const user = await service.get_user_me(req.headers.authorization)
    res.status(200).json(user)
  } catch (err) {
    log_error(err, req, res)
    error_handler(err, 404, req, res) 
  }
})

// update self
router.patch('/me/update', async (req, res) => {
  try {
    const token = res.locals.decoded
    const user = await service.update(token.user_id, req.body)
    res.status(200).json(user)
  } catch(err) {
    log_error(err, req, res)
    error_handler(err, 400, req, res)
  }
})


// DEVELOPMENT

router.get('/:id', async (req, res) => {
  try {
    const user = await service.get_user_by_id(req.params.id)
    res.status(200).json(user)
  } catch (err) {
    log_error(err, req, res)
  }
})


router.get('/', async (req, res) => {
  try {
    const users = await service.get_users()
    res.status(200).json(users)
  } catch(err) {
    log_error(err, req, res)
  }
})


router.put('/updateAll', async (req, res) => {
  try {
    const users = await service.update_all(req.body)
    res.status(200).json(users)
  } catch(err) {
    log_error(err, req, res)
  }
})


router.delete('/delete/:id', async (req, res) => {
  try {

  } catch(err) {

  }
})


export default router
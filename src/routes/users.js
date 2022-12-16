import express from 'express'
import { log_error, error_handler } from '../middlewares/error.handler.js'
import UserManager from '../services/users.manager.js'

const router = express.Router()
const user_manager = new UserManager()

// PRODUCTION

// get self
router.get('/me', async (req, res) => {
  try {
    const user = await user_manager.get_user_me(res.locals.decoded.user_id)
    
    res.status(200).json({
      success: true,
      message: "User received",
      data: {user}})

  } catch (err) {
    log_error(err, req, res)
    error_handler(err, 404, req, res) 
  }
})

// update self
router.patch('/me/update', async (req, res) => {
  try {
    const token = res.locals.decoded
    const user = await user_manager.update(token.user_id, req.body)
    
    res.status(200).json({
      success: true,
      message: "User updated",
      data: {user}})
  
  } catch(err) {
    log_error(err, req, res)
    error_handler(err, 400, req, res)
  }
})


// DEVELOPMENT

router.get('/:id', async (req, res) => {
  try {
    const user = await user_manager.get_user_by_id(req.params.id)
    
    res.status(200).json(user)
  
  } catch (err) {
    log_error(err, req, res)
  }
})


router.get('/', async (req, res) => {
  try {
    const users = await user_manager.get_users()
    res.status(200).json(users)
  } catch(err) {
    log_error(err, req, res)
  }
})


router.put('/updateAll', async (req, res) => {
  try {
    const users = await user_manager.update_all(req.body)
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
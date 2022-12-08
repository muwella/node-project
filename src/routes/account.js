import express from 'express'
import { error_handler } from '../middlewares/error.handler.js'
import UsersService from '../services/users.service.js'
import AccountManager from '../services/account.manager.js'

const router = express.Router()
const user_service = new UsersService()
const account_manager = new AccountManager()


// create account
router.post('/new', async (req, res) => {
  try {
    const user = req.body

    if (await user_service.username_taken(user.username)) {
      throw new Error('Username already taken')
    } else if (await user_service.email_taken(user.email)) {
      throw new Error('Email address already taken')
    }

    await user_service.create(user)
    res.status(201).send({'message': 'Account created'})
  
  } catch(err) {
    error_handler(err, 409, req, res)
  }
})


// confirm account
router.patch('/confirmation/:id', async (req, res) => {
  try {
    const id = req.params.id
    
    await account_manager.confirm(id)
    const user = await user_service.get_user_by_id(id)

    if (user.account_confirmed) {
      // res.status(200).json('Confirmation successful')
      res.json(user)
    } else {
      throw new Error('Error confirmating account')
    }

  } catch(err) {
    error_handler(err, 400, req, res)
  }
})


// deactivate account
router.patch('/deactivate', async (req, res) => {
  try {
    const token = res.locals.decoded
    
    await account_manager.deactivate(token.user_id)
    const user = await user_service.get_user_by_id(token.user_id)

    if (!user.active) {
      // res.status(200).json('Deactivation successful')
      res.json(user)
    } else {
      throw new Error('Error deactivating account')
    }

  } catch(err) {
    error_handler(err, 400, req, res)
  }
})


// recover account
router.patch('/recoverAccount/:id', async (req, res) => {
  try {
    const id = req.params.id

    await account_manager.recover(id)
    const user = await user_service.get_user_by_id(id)
    
    if (user.active) {
      // res.status(200).json('Recovery successful')
      res.json(user)
    } else {
      throw new Error('Error recovering account')
    }

  } catch(err) {
    log_error(err, req, res)
    error_handler(err, 400, req, res)
  }
})


// login
router.post('/login', async (req, res) => {
	try {
		const token = await account_manager.login(req.body)
		res.json(token)
	} catch (err) {
		error_handler(err, 400, req, res)
	}
})

export default router
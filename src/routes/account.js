import express from 'express'
import { error_handler } from '../middlewares/error.handler.js'
import verify_token from '../middlewares/token.js'
import UsersService from '../services/users.service.js'
import AccountManager from '../services/account.manager.js'

const router = express.Router()
const user_service = new UsersService()
const account_manager = new AccountManager()

// routes that need verify_token middleware
const verifyToken_router = express.Router()
verifyToken_router.use(verify_token)

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

    var user = await user_service.get_user_by_id(id)

    await account_manager.confirm_account(id)
    
    user = await user_service.get_user_by_id(id)
    
    if (user.account_confirmed) {
      res.status(201).json('Confirmation successful')
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
    console.log(req.locals.decoded)
    const token = req.locals.decoded
    const user = await service.update(token.user_id, { active: false })
    res.status(200).json(user)
  } catch(err) {
    error_handler(err, 400, req, res)
  }
})


// recover account
router.patch('/recoverAccount/:id', async (req, res) => {
  try {
    const { id } = req.params.id
    const user = await service.update(id, { active: true })
    res.status(200).json(user)
  } catch(err) {
    log_error(err, req, res)
    error_handler(err, 400, req, res)
  }
})


// login
router.post('/login', async (req, res) => {
	try {
		const token = await service.login(req.body)
		res.send(token)
	} catch (err) {
		error_handler(err, 400, req, res)
	}
})

export default router
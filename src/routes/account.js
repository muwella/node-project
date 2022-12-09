import express from 'express'
import { error_handler } from '../middlewares/error.handler.js'
import UsersService from '../services/users.service.js'
import AccountManager from '../services/account.manager.js'
import response from '../resources/response.js'

const router = express.Router()
const user_service = new UsersService()
const account_manager = new AccountManager()

// create account
router.post('/new', async (req, res) => {
  try {
    const user = req.body

    const credentials_are_available = await account_manager.credentials_are_available(user)

    for (credential in user) {
      if (await account_manager.is_invalid(credential)) {
        return response(res, 400, `Please enter a valid ${credential}`, null)
      }
    }
    
    if (credentials_are_available) {
      await account_manager.create(user)
    }

    user = await user_service.get_user_by_username(user.username)

    if (user) {
      response(res, 201, 'Account created', null)
    } else {
      response(res, 400, 'Error creating account', null)
    }
  
  } catch(err) {
    error_handler(err, 400, req, res)
  }
})


// confirm account
router.patch('/confirmation/:id', async (req, res) => {
  try {
    const id = req.params.id

    await account_manager.confirm(id)
    const user = await user_service.get_user_by_id(id)
    
    if (user.account_confirmed) {
      response(res, 200, 'Account confirmed successfully', user)
    } else {
      response(res, 400, 'Error confirming account', user)
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
      response(res, 200, 'Account deactivated successfully', null)
    } else {
      response(res, 400, 'Error deactivating account', null)
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
      response(res, 200, 'Account recovered successfully', user)
    } else {
      response(res, 400, 'Error recovering account', null)
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

    if (token) {
      response(res, 200, 'Logged in successfully, received JWT', token)
    } else {
      response(res, 400, 'Error logging in', null)
    }

	} catch (err) {
		error_handler(err, 400, req, res)
	}
})

export default router
import express from 'express'
import { error_handler } from '../middlewares/error.handler.js'
import AccountManager from '../services/account.manager.js'
import { response } from '../resources/response.js'
import isEmpty from 'is-empty'
import UserService from '../services/users.manager.js'
import { UserInCreate, UserInLogin } from '../types/user.js'

const router = express.Router()
const account_manager = new AccountManager()
const user_service = new UserService()

// create account
router.post('/new', async (req, res) => {
  try {
    const user: UserInCreate = req.body

    const credentials_exist = account_manager.check_credentials_existence(user)
    if (!credentials_exist) {
      return response(res, 400, 'MISSING_CREDENTIALS', null)
    }
    
    const credentials_available = await account_manager.check_credentials_availability(user)
    if (!credentials_available) {
      return response(res, 400, 'UNAVAILABLE_CREDENTIALS', null)
    }

    const syntax_error = account_manager.check_credentials_syntax(user)
    if ( !isEmpty(syntax_error) ) {
      return response(res, 400, 'INVALID_CREDENTIALS_SYNTAXIS', syntax_error)
    }

    await account_manager.create(user)

    response(res, 201, 'Account created', null)
    
  } catch(err) {
    error_handler(err, 400, req, res, null)
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
    error_handler(err, 400, req, res, null)
  }
})


// deactivate account
router.patch('/deactivate', async (req, res) => {
  try {
    const token = res.locals.decoded
    const id = res.locals.user_id
    
    await account_manager.deactivate(id)
    const user = await user_service.get_user_by_id(id)

    if (!user.active) {
      response(res, 200, 'Account deactivated successfully', null)
    } else {
      response(res, 400, 'Error deactivating account', null)
    }

  } catch(err) {
    error_handler(err, 400, req, res, null)
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
    error_handler(err, 400, req, res, null)
  }
})


// login
router.post('/login', async (req, res) => {
	try {
    const user_login: UserInLogin = req.body

    console.log(user_login)
    
    const user_exists = await user_service.check_user_exists(user_login)
    
    if (user_exists) {
      const hashPassword = await user_service.get_hash_password(user_login)
      const passwords_match = await user_service.compare_password(user_login.password, hashPassword)
      
      console.log(passwords_match)
      if (passwords_match) {
        const userDB = await user_service.get_user_for_token(user_login)
        
        const token = account_manager.login(userDB.id)
        console.log(token)
        response(res, 200, 'Logged in successfully, received JWT', token)
      } else {
        return response(res, 400, 'Wrong password', null)
      }
    } else {
      return response(res, 404, 'User does not exist', null)
    }

	} catch (err) {
		error_handler(err, 400, req, res, null)
	}
})

export default router
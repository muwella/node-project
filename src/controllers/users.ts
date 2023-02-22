import express from 'express'
import UserManager from '../services/users.manager.js'
import { UserInCreate, UserInLogin } from '../types/user.js'
import { Types } from 'mongoose'
import { response, message } from '../resources/response.js'
import isEmpty from 'is-empty'
import { error_handler } from '../middlewares/error.handler.js'

const router = express.Router()
const user_manager = new UserManager()

// create user
router.post('/new', async (req, res) => {
  try {
    const user: UserInCreate = req.body
    
    const missing_credentials = user_manager.check_credentials_existence(user)
    if (!isEmpty(missing_credentials)) {
      return response(res, 400, message.MISSING_CREDENTIALS, missing_credentials)
    }

    const unavailable_credentials = await user_manager.check_credentials_availability(user)
    if (!isEmpty(unavailable_credentials)) {
      return response(res, 400, message.UNAVAILABLE_CREDENTIALS, unavailable_credentials)
    }
    
    const invalid_credentials = user_manager.check_credentials_syntax(user)
    if (!isEmpty(invalid_credentials)) {
      return response(res, 400, message.INVALID_CREDENTIALS, invalid_credentials)
    }

    await user_manager.create(user)

    response(res, 201, 'Account created', null)
    
  } catch(err) {
    error_handler(err, 400, req, res, null)
  }
})

// confirm user
router.patch('/confirmation/:id', async (req, res) => {
  try {
    const id = new Types.ObjectId(req.params.id)

    // check if ID matches existing user
    const user_exists = await user_manager.check_user_exists(id)
    
    if (user_exists) {
      // check if it's already confirmed
      const account_confirmed = await user_manager.check_account_confirmed(id)

      if (account_confirmed) {
        response(res, 200, message.USER_ALREADY_CONFIRMED, null)
      } else {
        await user_manager.confirm(id)
        response(res, 200, message.USER_CONFIRMED_OK, null)
      }
    } else {
      response(res, 404, message.USER_NOT_FOUND, null)
    }
  } catch(err) {
    error_handler(err, 400, req, res, null)
  }
})


// deactivate user
router.patch('/deactivate', async (req, res) => {
  try {
    const token = res.locals.decoded
    const id = new Types.ObjectId(res.locals.user_id)
    
    await user_manager.deactivate(id)

    response(res, 200, message.USER_INACTIVE_OK, null)
    
    // DOUBT should i check to be sure that user has been deactivated? Or just trust that it was
    // const user = await user_service.get_user_by_id(id)

    // if (!user.active) {
    //   response(res, 200, message.USER_INACTIVE_OK, null)
    // } else {
    //   response(res, 400, 'Error deactivating account', null)
    // }

  } catch(err) {
    error_handler(err, 400, req, res, null)
  }
})


// recover user
router.patch('/recoverAccount/:id', async (req, res) => {
  try {
    const id = new Types.ObjectId(req.params.id)

    await user_manager.recover(id)
    const user = await user_manager.get_user_by_id(id)

    if (user) {
      if (user.active) {
        response(res, 200, 'Account recovered successfully', user)
      } else {
        response(res, 400, 'Error recovering account', null)
      }
    } else {
      response(res, 400, message.USER_NOT_FOUND, null)
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
    
    const user_exists = await user_manager.username_is_taken(user_login.username)
    
    if (user_exists) {
      const hashPassword = await user_manager.get_hash_password(user_login)
      const passwords_match = await user_manager.compare_password(user_login.password, hashPassword)
      
      console.log(passwords_match)
      if (passwords_match) {
        const userDB = await user_manager.get_user_for_token(user_login)
        
        const token = user_manager.login(userDB.id)
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




// WIP old users.ts

// get self
router.get('/me', async (req, res) => {
  try {
    const user = await user_manager.get_user_me(res.locals.decoded.user_id)
    
    res.status(200).json({
      success: true,
      message: "User received",
      data: {user}})

  } catch (err) {
    error_handler(err, 404, req, res, null) 
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
    error_handler(err, 400, req, res, null)
  }
})


// DEVELOPMENT

router.get('/:id', async (req, res) => {
  try {
    const id = new Types.ObjectId(req.params.id)
    const user = await user_manager.get_user_by_id(id)
    
    res.status(200).json(user)
  
  } catch (err) {
  }
})


router.get('/', async (req, res) => {
  try {
    const users = await user_manager.get_users()
    res.status(200).json(users)
  } catch(err) {
  }
})


router.put('/updateAll', async (req, res) => {
  try {
    const users = await user_manager.update_all(req.body)
    res.status(200).json(users)
  } catch(err) {
  }
})


router.delete('/delete/:id', async (req, res) => {
  try {
  } catch(err) {
  }
})


export default router
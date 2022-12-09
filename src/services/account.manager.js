import models from '../models/index.js'
import UsersService from './users.service.js'
import response from '../resources/response.js'

const user_service = new UsersService()

class AccountManager {
  // WIP finish and test
  async credentials_are_valid(user_signup) {
    const username_regex = /[A-Za-z][A-Za-z0-9_]/
    const email_regex = /[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/
    const password_regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}/
    
    const username_valid = username_regex.test(user_signup.username)
    const email_valid = email_regex.test(user_signup.email)
    const password_valid = password_regex.test(user_signup.password)
    
    return [username_valid, email_valid, password_valid]
  }
  
  // WIP finish and test
  async credentials_are_available(user_signup) {
    if (await user_service.username_taken(user_signup.username)) {
      return response(res, 409, 'Username is taken', null)
    } else if (await user_service.email_taken(user_signup.email)) {
      return response(res, 409, 'Email address is taken', null)
    } else {
      return true
    }
  }

  async hash_password(password) {
    return await bcrypt.hash(password, saltRounds)
  }
  
  async create(user) {
    user.password = await this.hash_password(user.password)
    await new models.UserModel(user).save()
  }
  
  async login(user_login) {
    const user_exists = await user_service.check_user_exists(user_login)

    if (user_exists) {
      const hashPassword = await user_service.get_hash_password(user_login)
      const passwords_match = await user_service.compare_password(user_login.password, hashPassword)

      if (passwords_match) {
        const userDB = await user_service.get_user_for_token(user_login)

        return user_service.issue_JWT(userDB._id)
      } else {
        return 'Wrong password'
      }
    } else {
      return 'User does not exist'
    }
  }

	async confirm(id) {
		await models.UserModel.findByIdAndUpdate(id, { account_confirmed: true })
	}
	
	async deactivate(id) {
		await models.UserModel.findByIdAndUpdate(id, { active: false })
	}
	
	async recover(id) {
		await models.UserModel.findByIdAndUpdate(id, { active: true })
	}
}

export default AccountManager
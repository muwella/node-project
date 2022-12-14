import models from '../models/index.js'
import UserService from './users.manager.js'
import isEmpty from 'is-empty'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const user_service = new UserService()

class AccountManager {
  check_credentials_existence(user) {    
    const missing = []

    if (!user.username) {
      missing.push('Username')
    }
    if (!user.email) {
      missing.push('Email')
    }
    if (!user.password) {
      missing.push('Password')
    }

    return missing
  }
  
  async check_credentials_availability(user) {
    const unavailable_credentials = []

    if (await user_service.username_taken(user.username)) {
      unavailable_credentials.push('Username')
    }
    if (await user_service.email_taken(user.email)) {
      unavailable_credentials.push('Email')
    }

    return unavailable_credentials
  }

  check_credentials_syntax(user) {
    const username_regex = /[A-Za-z][A-Za-z0-9_]/
    const email_regex = /[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/
    const password_regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}/
    
    const failed = []

    if (!username_regex.test(user.username)) {
      failed.push('Username')
    }
    if (!email_regex.test(user.email)) {
      failed.push('Email')
    }
    if (!password_regex.test(user.password)) {
      failed.push('Password')
    }

    return failed
  }
  
  async hash_password(password) {
    const saltRounds = 10
    return await bcrypt.hash(password, saltRounds)
  }
  
  async create(user) {
    user.password = await this.hash_password(user.password)
    await new models.UserModel(user).save()
  }
  
  login(id) {
    return jwt.sign({ "user_id": id }, process.env.PRIVATE_KEY)
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
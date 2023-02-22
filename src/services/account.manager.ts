import models from '../models/index.js'
import UserService from './users.manager.js'
import isEmpty from 'is-empty'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UserInCreate, UserInDB } from '../types/user.js'
import * as regex from '../resources/regex.js'
import { saltRounds } from '../resources/global.js'
import { get_private_key } from '../resources/env.js'
import { Types } from 'mongoose'

const user_service = new UserService()

class AccountManager {
  /**
   * Receives user creation form and checks that it has every mandatory UserInCreate property.
   * @param {UserInCreate} user
   * @returns {string[] | []} Missing properties, if any.
   */
  check_credentials_existence(user: UserInCreate): string[] | [] {
    const missing_credentials: string[] = []
    
    if (!user.username) {
      missing_credentials.push('username')
    }
    if (!user.email) {
      missing_credentials.push('email')
    }
    if (!user.password) {
      missing_credentials.push('password')
    }
    if (!user.name) {
      missing_credentials.push('name')
    }
    
    return missing_credentials
  }
  
  /**
   * Receives user creation form and checks that every unique property (username, email) is available.
   * @param user 
   * @returns {string[] | []} Unavailable properties, if any.
   */
  async check_credentials_availability(user: UserInCreate): Promise<string[] | []> {
    const unavailable_credentials: string[] = []

    if (await user_service.username_is_taken(user.username)) {
      unavailable_credentials.push('username')
    }
    if (await user_service.email_is_taken(user.email)) {
      unavailable_credentials.push('email')
    }

    return unavailable_credentials
  }

  /**
   * Receives user creation form and checks for proper syntax.
   * @param user 
   * @returns {string[] | []} Invalid properties, if any.
   */
  check_credentials_syntax(user: UserInCreate): string[] | [] {
    const invalid_credentials: string[] = []

    if (!regex.username_regex.test(user.username)) {
      invalid_credentials.push('username')
    }
    if (!regex.email_regex.test(user.email)) {
      invalid_credentials.push('email')
    }
    if (!regex.password_regex.test(user.password)) {
      invalid_credentials.push('password')
    }

    return invalid_credentials
  }

  /**
   * Checks in database if user exists by id.
   * @param {Types.ObjectId} id
   * @returns {boolean} True if id is used. False is no user is found.
   */
  async check_user_exists(id: Types.ObjectId): Promise<boolean> {
    const user = await this.get_user_by_id(id)
    return !isEmpty(user)
  }

  /**
   * Get user in database by id.
   * @param id
   * @returns {UserInDB | null} User instance or null.
   */
  async get_user_by_id(id: Types.ObjectId): Promise<UserInDB | null> {
    return await models.UserModel.findById(id)
  }
  
  /**
   * Encrypts a plain text password.
   * @param {string} password
   * @returns {string} Hashed password.
   */
  async hash_password(password: string): Promise<string> {
    return await bcrypt.hash(password, saltRounds)
  }
  
  /**
   * Receives user creation form and creates user instance in database.
   * @param user 
   */
  async create(user: UserInCreate): Promise<void> {
    user.password = await this.hash_password(user.password)
    await new models.UserModel(user).save()
  }

  /**
   * Searches for user in database and returns 'account_confirmed' property state.
   * @param {Types.ObjectId} id 
   * @returns {boolean} True if 'account_confirmed' is true. False if 'account_confirmed' is false.
   */
  async check_account_confirmed(id: Types.ObjectId): Promise<boolean> {
    const user = await this.get_user_by_id(id)
    if (user) {
      return user.account_confirmed
    } else {
      throw new Error('USER_NOT_FOUND')
    }
  }

  login(id: string) {
    return jwt.sign({ "user_id": id }, get_private_key())
  }

	async confirm(id: Types.ObjectId) {
		await models.UserModel.findByIdAndUpdate(id, { account_confirmed: true })
	}
	
  /**
   * Receives user id and deactivates their account.
   * @param {Types.ObjectId} id
   */
	async deactivate(id: Types.ObjectId) {
		await models.UserModel.findByIdAndUpdate(id, { active: false })
	}
	
	async recover(id: Types.ObjectId) {
		await models.UserModel.findByIdAndUpdate(id, { active: true })
	}
}

export default AccountManager
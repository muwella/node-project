import models from '../models/index.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import isEmpty from 'is-empty'
import { saltRounds } from '../resources/global.js'
import { UserInCreate, UserInDB, UserInLogin } from '../types/user.js'
import { userChange } from '../types/change.js'
import { get_private_key } from '../resources/env.js'
import * as regex from '../resources/regex.js'
import { Types } from 'mongoose'

class UserManager {
  // PRODUCTION

  // WIP old account_manager //

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

    if (await this.username_is_taken(user.username)) {
      unavailable_credentials.push('username')
    }
    if (await this.email_is_taken(user.email)) {
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

  // WIP wtf quise hacer acá
  login(id: string) {
    this.issue_JWT(id)
    // return jwt.sign({ "sub": id }, get_private_key())
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





  // WIP old user_manager //

  /**
   * Receives username and checks on database if it is already taken by another user.
   */
  async username_is_taken(username: string): Promise<Boolean> {
    const user_in_db = await models.UserModel.findOne({username: username})
    if (!user_in_db) {
      return false
    } else {
      return true
    }
  }

  /**
   * Receives email and checks on database if it is already taken by another user.
   */
  async email_is_taken(email: string): Promise<Boolean> {
    const user_in_db = await models.UserModel.findOne({email: email})
    if (!user_in_db) {
      return false
    } else {
      return true
    }
  }

  async compare_password(plaintextPassword: string, hash: string) {
    return await bcrypt.compare(plaintextPassword, hash);
  }

  async get_hash_password(user: UserInLogin) {
    const userDB = await this.get_user_by_username_with_password(user.username)
    return userDB.password
  }

  async get_user_for_token(user: UserInLogin) {
    return await this.get_user_by_username(user.username)
  }

  // LATER have tokens expire and refresh them
  issue_JWT(id: string) {
    return jwt.sign({ "sub": id }, get_private_key())
  }

  async get_users() {
    return await models.UserModel.find()
  }

  async get_user_me(id: string) {
    return await models.UserModel.findOne({_id: id})
  }

  async get_user_by_username(username: string) {
    const userInDB = await models.UserModel.findOne({username: username}, {password:0})
    if (!userInDB) {
      throw new Error('USER_NOT_FOUND')
    } else {
      return userInDB
    }
  }

  async get_user_by_email(email: string) {
    return await models.UserModel.findOne({email: email}, {password:0})
  }

  async get_user_by_username_with_password(username: string): Promise<UserInDB> {
    const user: UserInDB | null = await models.UserModel.findOne({username: username})
    if (!user) {
      throw new Error('USER_NOT_FOUND')
    } else {
      return user
    }
  }

  async get_user_by_email_with_password(email: string): Promise<UserInDB> {
    const user: UserInDB | null = await models.UserModel.findOne({email: email})
    if (!user) {
      throw new Error('USER_NOT_FOUND')
    } else {
      return user
    }
  }

  async update(id: Types.ObjectId, change: object) {
    change = {
      ...change,
      update_date: Date.now()
    }

    await models.UserModel.findByIdAndUpdate(id, change, { runValidators: true })
    return await this.get_user_by_id(id)
  }

  async delete(id: Types.ObjectId) {
    await this.update(id, { active: false })
  }

  // DEVELOPMENT

  constructor() {
    // this.generate()
  }

  async generate() {
    const limit = 1
    
    for (let i = 0; i < limit; i++) {      
      const user = new models.UserModel({
        username: 'muwella',
        email: 'marielabrascon@gmail.com',
        password: await bcrypt.hash('someVerySecurePassword', saltRounds)
      })
      
      // await user.save()
    }
  }

  // NOTE UserSchema has to match with attempted changes
  // to $set: field on schema with default value
  // to $unset: field not on the schema
  async update_all(change: userChange) {
    for (const key in change) {
      // if type is set, add field
      if (change.type == "set") {
        const users = await models.UserModel.updateMany(
          {}, // all documents
          { $set: {key: change.value} },
          { upsert: true }
        )
        console.log(users)
      }

      // if type is unset, remove field
      if (change.type == "unset") {
        await models.UserModel.updateMany(
          {}, // all documents
          { $unset: {key} }
        )
      }
    }
    return await models.UserModel.find()
  }
}

export default UserManager
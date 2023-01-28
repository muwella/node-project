import models from '../models/index.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import isEmpty from 'is-empty'
import { saltRounds } from '../resources/global.js'
import { UserInDB, UserInLogin } from '../types/user.js'
import { get_private_key } from '../resources/env.js'
import { userChange } from '../types/change.js'

class UserService {
  // PRODUCTION

  async username_taken(username: string) {
    const is_taken = !isEmpty(await this.get_user_by_username(username))
    return is_taken
  }

  async email_taken(email: string) {
    const is_taken = !isEmpty(await this.get_user_by_email(email))
    return is_taken
  }
  
  async check_user_exists(user: UserInLogin) {
    return await this.username_taken(user.username)
  }

  async user_exists(id: string) {
    const exists = !isEmpty(await this.get_user_by_id(id))
    return exists
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
    return jwt.sign({ "user_id": id }, get_private_key())
  }
  
  async get_users() {
    return await models.UserModel.find()
  }

  async get_user_me(id: string) {
    return await models.UserModel.findOne({_id: id})
  }

  async get_user_by_id(id: string): Promise<UserInDB> {
    const user: UserInDB | null = await models.UserModel.findOne({_id: id})
    if (!user) {
      throw new Error('USER_NOT_FOUND')
    } else {
      return user
    }
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
  
  async update(id: string, change: object) {
    change = {
      ...change,
      update_date: Date.now()
    }

    await models.UserModel.findByIdAndUpdate(id, change, { runValidators: true })
    return await this.get_user_by_id(id)
  }

  async delete(id: string) {
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

export default UserService
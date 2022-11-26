import models from '../models/index.js'
import empty from 'is-empty'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const saltRounds = 10

// users management
class UsersService {
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

  async username_taken(username) {
    const is_taken = !empty(await this.get_user_by_username(username))
    return is_taken
  }

  async email_taken(email) {
    const is_taken = !empty(await this.get_user_by_email(email))
    return is_taken
  }
  
  async check_user_exists(user) {
    if (user.username) {
      return await this.username_taken(user.username)
    } else if (user.email) {
      return await this.email_taken(user.email)
    }
  }

  async compare_password(plaintextPassword, hash) {
    return await bcrypt.compare(plaintextPassword, hash);
  }

  async get_hash_password(user) {
    if (user.username) {
      const userDB = await this.get_user_by_username_with_password(user.username)
      return userDB.password
    } else if (user.email) {
      const userDB = await this.get_user_by_email_with_password(user.email)
      return userDB.password
    }
  }

  async get_user_for_token(user) {
    if (user.username) {
      const userDB = await this.get_user_by_username(user.username)
      return userDB
    } else if (user.email) {
      return await this.get_user_by_email(user.email)
    }
  }

  async login(user_login) {
    // check if user exists
    const user_exists = await this.check_user_exists(user_login)

    if (user_exists) {
      // check if passwords match
      const hashPassword = await this.get_hash_password(user_login)
      const passwords_match = await this.compare_password(user_login.password, hashPassword)

      if (passwords_match) {
        const userDB = await this.get_user_for_token(user_login)

        // issue a JWT
        return jwt.sign({ "user_id": userDB._id }, process.env.PRIVATE_KEY, { expiresIn: '7d' })
      } else {
        return 'Wrong password'
      }
    } else {
      return 'User does not exist'
    }
  }

  async hash_password(password) {
    return await bcrypt.hash(password, saltRounds)
  }

  async create(user) {
    // check if any required fields already exist
    if (await this.username_taken(user.username)) {
      throw new Error('Username already taken')
    } else if (await this.email_taken(user.email)) {
      throw new Error('Email address already taken')
    }

    const user_login = {
      'username': user.username,
      'email': user.email,
      'password': user.password
    }
    
    // hash password
    user.password = await this.hash_password(user.password)

    // save on DB
    await new models.UserModel(user).save()

    // login user
    return await this.login(user_login)
  }

  async get_users() {
    return await models.UserModel.find()
  }

  async get_user_by_id(id) {
    return await models.UserModel.findOne({_id: id}, {password:0})

    // should not check this on here
    if ( empty(user) ) {
      throw new Error('User not found')
    } else {
      return user
    }
  }
  
  async get_user_by_username(username) {
    return await models.UserModel.findOne({username: username}, {password:0})
  }
  
  async get_user_by_email(email) {
    return await models.UserModel.findOne({email: email}, {password:0})
  }

  async get_user_by_username_with_password(username) {
    return await models.UserModel.findOne({username: username})
  }
  
  async get_user_by_email_with_password(email) {
    return await models.UserModel.findOne({email: email})
  }


  // NOTE UserSchema has to match with attempted changes
  // to $set: field on schema with default value
  // to $unset: field not on the schema
  async update_all(change) {
    for (const key in change) {
      // if type is set, add field
      if (change[key].type == 'set') {
        const users = await models.UserModel.updateMany(
          {}, // all documents
          { $set: {key: change[key].value} },
          { upsert: true }
        )
        console.log(users)
      }

      // if type is unset, remove field
      if (change[key].type == 'unset') {
        await models.UserModel.updateMany(
          {}, // all documents
          { $unset: {key} }
        )
      }
    }
    return await models.UserModel.find()
  }

  async update(id, change) {
    await models.UserModel.findByIdAndUpdate(id, change)
    return await this.get_user_by_id(id)
  }

  async delete(id) {
    await models.UserModel.findByIdAndDelete(id)
  }
}

export default UsersService
import models from '../models/index.js'
import empty from 'is-empty'
import bcrypt from 'bcrypt'

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
      
      await user.save()
    }
  }

  async hash_password(password) {
    return await bcrypt.hash(password, saltRounds)
  }

  async create(user) {
    // validate schema

    // hash password
    user.password = await this.hash_password(user.password)

    // try to save on DB
    try {
      userinDB = new models.UserModel({user})
      await userinDB.save()
    } catch(err) {
      console.error(err)
    }
  }

  async get_users() {
    return await models.UserModel.find()
  }

  async get_user_by_id(id) {
    const user = await models.UserModel.findById(id)

    if ( empty(user) ) {
      throw new Error('User not found')
    } else {
      return user
    }
  }
  
  async update() {
  }

  async partial_update() {

  }

  async delete() {
  }
}

export default UsersService
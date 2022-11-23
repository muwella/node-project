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
      
      // await user.save()
    }
  }

  async hash_password(password) {
    return await bcrypt.hash(password, saltRounds)
  }

  async compare_password(plaintextPassword, hash) {
    return await bcrypt.compare(plaintextPassword, hash);
  }

  async check_user(username, password) {
    const user = {}
    try {
      user = await models.UserModel.findOne(username = username)
    } catch(err) {
      console.error(err)
    }

    const match = await bcrypt.compare(password, user.password);

    if(match) {
        //login
    }

    //...
  }

  async create(user) {
    // check if any required fields already exist
    const usernameTaken = !empty(await models.UserModel.find({username: user.username}))
    const emailTaken = !empty(await models.UserModel.find({email: user.email}))
    
    if (usernameTaken) {
      throw new Error('Username already taken')
    } else if (emailTaken) {
      throw new Error('Email address already taken')
    }

    // hash password
    user.password = await this.hash_password(user.password)

    // save on DB
    await new models.UserModel(user).save()

    // return user without password
    return await this.get_user_by_username(user.username)
  }

  async get_users() {
    return await models.UserModel.find()
  }

  async get_user_by_id(id) {
    const user = await models.UserModel.findOne({_id: id}, {password:0})

    if ( empty(user) ) {
      throw new Error('User not found')
    } else {
      return user
    }
  }
  
  async get_user_by_username(username) {
    const user = await models.UserModel.findOne({username: user.username}, {password:0})

    if ( empty(user) ) {
      throw new Error('User not found')
    } else {
      return user
    }
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
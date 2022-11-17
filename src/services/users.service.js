import models from '../models/index.js'
import empty from 'is-empty'


// categories management
class UsersService {
  constructor() {
    // this.generate()
  }

  // WIP Manager user, creator of Uncategorized category
  async generate() {
    const limit = 1
    
    for (let i = 0; i < limit; i++) {      
      const user = new models.UserModel({
        username: 'muwella',
        email: 'marielabrascon@gmail.com',
        password: 'someVerySecurePassword'
      })
      
      await user.save()
    }
  }

  async create() {
  }

  async get_users() {
  }

  async get_user_by_id(id) {
  }
  
  async update() {
  }

  async delete() {
  }
}

export default UsersService
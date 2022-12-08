import models from '../models/index.js'
import UsersService from './users.service.js'

const user_service = new UsersService()

class AccountManager {
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
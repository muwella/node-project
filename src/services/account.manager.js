import models from '../models/index.js'

// users management
class AccountManager {
	async confirm_account(id) {
		await models.UserModel.findByIdAndUpdate(id, { account_confirmed: true })
	}
}

export default AccountManager
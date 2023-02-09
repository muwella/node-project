export default {
	username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
	name: {
    type: String,
    default: ''
  },
	creation_date: {
    type: Date,
    default: Date.now
  },
  update_date: {
		type: Date,
		default: Date.now
	},
  active: {
    type: Boolean,
    default: true
  },
  account_confirmed: {
    type: Boolean,
    default: false
  }
}
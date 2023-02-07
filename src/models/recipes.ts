import mongoose from 'mongoose'

export default {
	name: {
		type: String,
		required: true
	},
	instructions: String,
	ingredients: [String],
	categories: [mongoose.Types.ObjectId],
	creator_id: {
		type: mongoose.Types.ObjectId,
		required: true
	},
	creation_date: {
		type: Date,
		default: Date.now
	},
	update_date: {
		type: Date,
		default: Date.now
	}
}
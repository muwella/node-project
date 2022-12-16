import mongoose from "mongoose"

export default {
	name: {
		type: String,
		required: true
	},
	ingredients: [String], // now it's words, then it'll be UUIDs
	instructions: [String],
	creator_id: {
		type: mongoose.Types.ObjectId,
		required: [true, 'Creator ID required']
	},
	category: [mongoose.Types.ObjectId],
	creation_date: {
		type: Date,
		default: Date.now
	},
	update_date: {
		type: Date,
		default: Date.now
	}
}
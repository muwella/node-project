import mongoose from "mongoose"

// WIP changed category to categories
	// erase everything from the db

export default {
	name: {
		type: String,
		required: true
	},
	ingredients: [String], // now it's words, then it'll be UUIDs
	instructions: String,
	creator_id: {
		type: mongoose.Types.ObjectId,
		required: [true, 'Creator ID required']
	},
	categories: [mongoose.Types.ObjectId],
	creation_date: {
		type: Date,
		default: Date.now
	},
	update_date: {
		type: Date,
		default: Date.now
	}
}
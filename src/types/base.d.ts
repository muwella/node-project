import { Types } from "mongoose"

// basic data that gets repeated all across database
export interface BaseModel {
	readonly id: Types.ObjectId,
	readonly created_at: Date,
	updated_at: Date
}

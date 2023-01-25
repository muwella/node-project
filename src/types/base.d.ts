import { Types } from "mongoose"

// basic data that gets repeated all across database
export interface BaseModel {
	readonly id: Types.ObjectId,
	readonly createdAt: Date,
	updatedAt: Date
}

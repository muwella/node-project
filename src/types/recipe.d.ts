import { BaseModel } from "./base.d.ts"
import { Types } from "mongoose"

// received from user
export interface RecipeInCreate {
    name: string,
    instructions?: string,
    ingredients?: string[],
    categories?: Types.ObjectId[],
}

// sent to user
// FIXME RecipeInDB extended from BaseModel and RecipeInCreate, and it does not have id (should have bc of BaseModel)
// export interface RecipeInDB extends BaseModel, RecipeInCreate {}

// hardcoded
export interface RecipeInDB {
    readonly id: Types.ObjectId,
	readonly created_at: Date,
	updated_at: Date,
    creator_id: Types.ObjectId,
    name: string,
    instructions?: string,
    ingredients?: string[],
    categories?: Types.ObjectId[],
}

// received from user
export type RecipeInUpdate = Partial<RecipeInCreate>

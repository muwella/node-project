import { BaseModel } from "./base.d.ts"
import { Types } from "mongoose"

// received from user
export interface RecipeInCreate {
    name: string,
    readonly creator_id: Types.ObjectId,
    instructions?: string,
    ingredients?: string[],
    categories?: Types.ObjectId[],
}

// sent to user
export interface RecipeInDB extends BaseModel, RecipeInCreate {}

// received from user
export type RecipeInUpdate = Partial<RecipeInCreate>

import { BaseModel } from "./base.d.ts"
import { Types } from "mongoose"

// received from user
export interface CategoryInCreate {
    name: string,
    readonly creator_id: Types.ObjectId
}

// sent to user
export interface CategoryInDB extends BaseModel, CategoryInCreate {}

// received from user
export type CategoryInUpdate = Partial<CategoryInCreate>

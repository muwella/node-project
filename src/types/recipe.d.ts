import { BaseModel } from "./base.d.ts"
import { Types } from "mongoose"

interface RecipeBase extends BaseModel {
    name: string,
    instructions: string,
    ingredients: Types.ObjectId[],
    creator_id: Types.ObjectId,
}

// sent to user
// this scheme has DB added info
interface UserInResponse extends UserBase {
    is_confirmed: boolean,
    is_active: boolean,
}

// received from user
interface UserInCreate extends UserBase {
    password: string
}

// received from user
interface UserInUpdate extends Partial<UserBase>{}

// -----

interface UserLogin {
    username: string,
    password: string
}

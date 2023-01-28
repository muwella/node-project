import { Types } from "mongoose"
import { BaseModel } from "./base.d.ts"

interface UserBase {
    username: string,
    email: string,
    name: string
}

// received from user
export interface UserInCreate extends UserBase {
    password: string
}

// received from user
    // user can change only their name and password
export type UserInUpdate = Partial<Omit<UserInCreate, 'username' | 'email'>>

// received from user
export type UserInLogin = Pick<UserInCreate, 'username' | 'password'>

// user in db
export interface UserInDB extends BaseModel, UserInCreate {
    account_confirmed: boolean,
    active: boolean = true
}

// sent to user
export type UserInResponse = Omit<UserInDB, 'password'>
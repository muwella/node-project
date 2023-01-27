import { BaseModel } from "./base.d.ts"

interface UserBase {
    username: string,
    email: string,
    name: string
}

// sent to user
export interface UserInResponse extends BaseModel, UserBase {
    is_confirmed: boolean,
    is_active: boolean
}

// received from user
export interface UserInCreate extends UserBase {
    password: string
}

// received from user
export type UserInUpdate = Partial<UserInCreate>

// received from user
export type UserInLogin = Pick<UserInCreate, 'username' | 'password'>

import { BaseModel } from "./base.d.ts"

interface UserBase {
    username: string,
    email: string,
    name: string
}

// sent to user
interface UserInResponse extends BaseModel, UserBase {
    is_confirmed: boolean,
    is_active: boolean
}

// received from user
interface UserInCreate extends UserBase {
    password: string
}

// received from user
type UserInUpdate = Partial<UserInCreate>

// received from user
type UserInLogin = Pick<UserInCreate, 'username' | 'password'>

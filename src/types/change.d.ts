import { UserInDB } from "./user"

// NOTE
// this would be used for big general changes on every document

enum UserProperty {
    username = "username",
    email = "email",
    password = "password",
    name = "name",
    creation_date = "creation_date",
    update_date = "update_date",
    active = "active",
    account_confirmed = "account_confirmed"
}

enum ChangeType {
    set = "set",
    unset = "unset"
}

interface userChange {
    type: Type,
    property: string,
    value: any
}
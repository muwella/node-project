import models from '../models/index.js';
import UserService from './users.manager.js';
import isEmpty from 'is-empty';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as regex from '../resources/regex.js';
import { saltRounds } from '../resources/global.js';
import { get_private_key } from '../resources/env.js';
const user_service = new UserService();
class AccountManager {
    // WIP i want it to return which credential doesnt exist, if any
    check_credentials_existence(user) {
        for (var credential in user) {
            if (isEmpty(credential))
                return false;
        }
        return true;
    }
    // WIP i want it to return which credential is unavailable, if any
    async check_credentials_availability(user) {
        if (await user_service.username_taken(user.username)) {
            return false;
        }
        if (await user_service.email_taken(user.email)) {
            return false;
        }
        return true;
    }
    check_credentials_syntax(user) {
        const failed = [];
        if (!regex.username_regex.test(user.username)) {
            failed.push('Username');
        }
        if (!regex.email_regex.test(user.email)) {
            failed.push('Email');
        }
        if (!regex.password_regex.test(user.password)) {
            failed.push('Password');
        }
        return failed;
    }
    async hash_password(password) {
        return await bcrypt.hash(password, saltRounds);
    }
    async create(user) {
        user.password = await this.hash_password(user.password);
        await new models.UserModel(user).save();
    }
    login(id) {
        return jwt.sign({ "user_id": id }, get_private_key());
    }
    async confirm(id) {
        await models.UserModel.findByIdAndUpdate(id, { account_confirmed: true });
    }
    async deactivate(id) {
        await models.UserModel.findByIdAndUpdate(id, { active: false });
    }
    async recover(id) {
        await models.UserModel.findByIdAndUpdate(id, { active: true });
    }
}
export default AccountManager;

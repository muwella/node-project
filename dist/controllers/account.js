import express from 'express';
import { error_handler } from '../middlewares/error.handler.js';
import AccountManager from '../services/account.manager.js';
import { response, message } from '../resources/response.js';
import isEmpty from 'is-empty';
import UserService from '../services/users.manager.js';
import { Types } from 'mongoose';
const router = express.Router();
const account_manager = new AccountManager();
const user_service = new UserService();
// create account
router.post('/new', async (req, res) => {
    try {
        const user = req.body;
        const missing_credentials = account_manager.check_credentials_existence(user);
        if (!isEmpty(missing_credentials)) {
            return response(res, 400, message.MISSING_CREDENTIALS, missing_credentials);
        }
        const unavailable_credentials = await account_manager.check_credentials_availability(user);
        if (!isEmpty(unavailable_credentials)) {
            return response(res, 400, message.UNAVAILABLE_CREDENTIALS, unavailable_credentials);
        }
        const invalid_credentials = account_manager.check_credentials_syntax(user);
        if (!isEmpty(invalid_credentials)) {
            return response(res, 400, message.INVALID_CREDENTIALS, invalid_credentials);
        }
        await account_manager.create(user);
        response(res, 201, 'Account created', null);
    }
    catch (err) {
        error_handler(err, 400, req, res, null);
    }
});
// confirm account
router.patch('/confirmation/:id', async (req, res) => {
    try {
        const id = new Types.ObjectId(req.params.id);
        // check if ID matches existing user
        const user_exists = await account_manager.check_user_exists(id);
        if (user_exists) {
            // check if it's already confirmed
            const account_confirmed = await account_manager.check_account_confirmed(id);
            if (account_confirmed) {
                response(res, 100, message.USER_ALREADY_CONFIRMED, null);
            }
            else {
                await account_manager.confirm(id);
                response(res, 200, message.USER_CONFIRMED_OK, null);
            }
        }
        else {
            response(res, 404, message.USER_NOT_FOUND, null);
        }
    }
    catch (err) {
        error_handler(err, 400, req, res, null);
    }
});
// deactivate account
router.patch('/deactivate', async (req, res) => {
    try {
        const token = res.locals.decoded;
        const id = new Types.ObjectId(res.locals.user_id);
        await account_manager.deactivate(id);
        response(res, 200, message.USER_INACTIVE_OK, null);
        // DOUBT should i check to be sure that user has been deactivated? Or just trust that it was
        // const user = await user_service.get_user_by_id(id)
        // if (!user.active) {
        //   response(res, 200, message.USER_INACTIVE_OK, null)
        // } else {
        //   response(res, 400, 'Error deactivating account', null)
        // }
    }
    catch (err) {
        error_handler(err, 400, req, res, null);
    }
});
// recover account
router.patch('/recoverAccount/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await account_manager.recover(id);
        const user = await user_service.get_user_by_id(id);
        if (user.active) {
            response(res, 200, 'Account recovered successfully', user);
        }
        else {
            response(res, 400, 'Error recovering account', null);
        }
    }
    catch (err) {
        error_handler(err, 400, req, res, null);
    }
});
// login
router.post('/login', async (req, res) => {
    try {
        const user_login = req.body;
        console.log(user_login);
        const user_exists = await user_service.check_user_exists(user_login);
        if (user_exists) {
            const hashPassword = await user_service.get_hash_password(user_login);
            const passwords_match = await user_service.compare_password(user_login.password, hashPassword);
            console.log(passwords_match);
            if (passwords_match) {
                const userDB = await user_service.get_user_for_token(user_login);
                const token = account_manager.login(userDB.id);
                console.log(token);
                response(res, 200, 'Logged in successfully, received JWT', token);
            }
            else {
                return response(res, 400, 'Wrong password', null);
            }
        }
        else {
            return response(res, 404, 'User does not exist', null);
        }
    }
    catch (err) {
        error_handler(err, 400, req, res, null);
    }
});
export default router;

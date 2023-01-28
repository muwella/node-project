import jwt from 'jsonwebtoken';
import { no_token_required_paths } from '../resources/regex.js';
import { get_private_key } from '../resources/env.js';
const path_requires_token = (url) => {
    const requires_token = no_token_required_paths.some(regexp => {
        return regexp.test(url);
    });
    return requires_token;
};
export const verify_token = async (req, res, next) => {
    if (path_requires_token(req.url)) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                throw new Error('TOKEN_REQUIRED');
            }
            // verify token
            res.locals.decoded = jwt.verify(token, get_private_key());
            // add user_id to locals for usage in functions
            res.locals.user_id = res.locals.decoded.user_id;
        }
        catch (err) {
            return res.status(400).json(err);
        }
    }
    next();
};

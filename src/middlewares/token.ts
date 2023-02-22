import jwt, { JwtPayload } from 'jsonwebtoken'
import { no_token_required_paths } from '../resources/regex.js'
import { get_private_key } from '../resources/env.js'
import { Request, Response } from 'express'
import { Types } from 'mongoose'
import { message } from '../resources/response.js'

const path_requires_token = (url: string) => {
	const requires_token = no_token_required_paths.some(regexp => {
		return regexp.test(url)
	})

	return requires_token
}

export const verify_token = async (req: Request, res: Response, next: Function) => {
	if ( path_requires_token(req.url) ) {
		try {
			// if token is found
			if (typeof req.headers.authorization == 'string') {
				// verify token
				jwt.verify(req.headers.authorization, get_private_key());
				
				// save user_id on local for later use in controllers
				res.locals.user_id = jwt.decode(req.headers.authorization) as {
					sub: string
				}
			} else {
				throw new Error(message.JWT_NOT_FOUND)
			}
		} catch(err) {
			return res.status(400).json(err)
		}
	}
	next()
}
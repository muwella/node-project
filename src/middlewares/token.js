// @ts-check

import jwt from 'jsonwebtoken'
// import { Request, Response } from 'express';


const no_token_required_paths = [
	/(\/api\/v1\/account\/login)/i,
	/(\/api\/v1\/account\/new)/i,
	/(\/api\/v1\/account\/confirmation\/\w)/i,
	/(\/api\/v1\/account\/recoverAccount\/\w)/i,
]

const path_requires_token = (url) => {
	const paths_match = no_token_required_paths.some(regexp => {
		return regexp.test(url)
	})
	
	// if paths match, it doesn't require token
	// if !paths_match, it requires token
	return !paths_match
}

export const verify_token = async (req, res, next) => {
	if ( path_requires_token(req.url) ) {
		try {
			const token = req.headers.authorization

			// check private key existence
			const private_key = process.env.PRIVATE_KEY
			if (!private_key) { throw new Error('PRIVATE_KEY NOT FOUND') }

			// verify token
			res.locals.decoded = jwt.verify(token, private_key);

			// add user_id to locals for usage in functions
			res.locals.user_id = res.locals.decoded.user_id
		} catch(err) {
			return res.status(400).json(err)
		}
	}
	next()
}
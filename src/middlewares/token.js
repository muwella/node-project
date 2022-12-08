import jwt from 'jsonwebtoken'
import { pathToRegexp } from 'path-to-regexp'
// import UsersService from '../services/users.service.js';
// const user_service = new UsersService()

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

const verify_token = async (req, res, next) => {
	if ( path_requires_token(req.url) ) {
		try {
			const token = req.headers.authorization
			res.locals.decoded = jwt.verify(token, process.env.PRIVATE_KEY);
		} catch(err) {
			res.status(400).json(err)
			res.end()
		}
	}
	next()
}

// ** not working **

// if no token received
		// if (!token) {
		// 	res.status(400).json(err.JWT_MISSING)
		// 	res.end()
		// }
		
		// if token has no user ID
		// if (!decoded.user_id) {
			// 	res.status(400).json(err.JWT_MISSING_USERID)
			// 	next()
			// }
			
			// // if no user matches with user ID
			// const user = await user_service.get_user_by_id(decoded.user_id)
			// if(empty(user) || !user.active) res.status(404).json(err.USER_NOT_FOUND)


export default verify_token
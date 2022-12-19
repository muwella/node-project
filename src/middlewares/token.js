import jwt from 'jsonwebtoken'

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
			res.locals.user_id = res.locals.decoded.user_id
		} catch(err) {
			return res.status(400).json(err)
		}
	}
	next()
}

export default verify_token
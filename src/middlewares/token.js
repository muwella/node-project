import jwt from 'jsonwebtoken'

const verify_token = (req, res, next) => {
	if(req.url != '/api/v1/users/new' || req.method != 'POST') {
		try {
			const encoded = jwt.verify(req.headers.authorization, process.env.PRIVATE_KEY);
		} catch(err) {
			res.status(400).json({'todo': 'mal'})
			console.error(err)
		}
	}
	next()
}

export default verify_token
import jwt from 'jsonwebtoken'

const verify_token = (req, res, next) => {
	if(req.url != '/api/v1/users/new' && req.url != '/api/v1/login') {
		try {
			const token = req.headers.authorization
			jwt.verify(token, process.env.PRIVATE_KEY);
		} catch(err) {
			console.log(err)
			res.json(err)
		}
	}
	next()
}

export default verify_token
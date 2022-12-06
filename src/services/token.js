import jwt from 'jsonwebtoken'

// token management
class TokenService {
  async decode(token) {
		return jwt.decode(token)
	}
}

export default TokenService
import express from 'express'
import { log_error, error_handler } from '../middlewares/error.handler.js'
import UsersService from '../services/users.service.js'

const router = express.Router()
const service = new UsersService()

router.post('/', async (req, res) => {
	try {
		const token = await service.login(req.body)
		res.status(200).json(token)
	} catch (err) {
		log_error(err, req, res)
		error_handler(err, 400, req, res)
	}
})

export default router
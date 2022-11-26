import 'colors'

const log_error = (err, req, res, next) => {
	console.error(err.stack.red)
}

const error_handler = (err, status, req, res, next) => {
	res.status(status).json({
		message: err.message
	})
}

export { log_error, error_handler }
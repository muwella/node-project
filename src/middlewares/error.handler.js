import colors from 'colors'

const log_error = (err, req, res) => {
	console.error(err.message.red)
}

const error_handler = (err, status, req, res) => {
	res.status(status).json({
		message: err.message
	})
}

export { log_error, error_handler }
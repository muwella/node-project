const log_error = (err, req, res, next) => {
	console.error(err)
	next(err)
}

const error_handler = (err, req, res, next) => {
	res.status(500).json({
		message: err.message,
		stack: err.stack
	})
}

export { log_error, error_handler }
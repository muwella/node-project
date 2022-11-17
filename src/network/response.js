const sucess = (status, req, res, message) => {
	res.status(status || 200).send(message)
}

const error = (status, req, res, message) => {
	res.status(status || 500).send(message)
}

export { sucess, error }
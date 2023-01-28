import { Request, Response } from "express"

export const error_handler = (err: unknown, status: number, req: Request, res: Response, next: Function | null) => {
	let message: string = ''
	if (err instanceof Error) message = err.message
	
	return res.status(status).json({
		success: false,
		message,
		data: err
	})
}

export const log_error = (err: unknown) => {
	console.error(err)
}
import { Response } from 'express'

export const response = (res: Response, status: number, message: string, data: unknown) => {
	res.status(status).json(
		{success: status < 300,
		message,
		data}
	)
}
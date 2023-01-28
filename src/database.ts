import 'colors'
import mongoose from 'mongoose'

const dbConnection = async () => {
	try {
		await mongoose.connect('mongodb://127.0.0.1:27017/kittchen')
		// use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/kittchen');` if database has auth enabled
		console.log('Succesful connection to DB'.cyan)
	}
	catch(err) {
		console.log('Error connecting to DB'.red)
		console.error(err)
	}
}

export default dbConnection

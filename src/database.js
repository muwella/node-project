import 'colors'
import mongoose from 'mongoose'

const dbConnection = async () => {
	try {
		await mongoose.connect('mongodb://localhost:27017/kittchen', {
			useNewUrlParser: true,
      useUnifiedTopology: true
		})
		// use `await mongoose.connect('mongodb://user:password@localhost:27017/kittchen');` if your database has auth enabled
		console.log('Succesful connection to DB'.cyan)
	}
	catch(err) {
		console.log('Error connecting to DB'.red)
		console.error(err)
	}
}

export default dbConnection

import express from 'express'
import testRouter from './test.js'
import usersRouter from './users.js'
import recipesRouter from './recipes.js'
// import ingredientsRouter from './ingredients.js'
import categoriesRouter from './categories.js'

const app = express()

const router = express.Router()
// there can be several versions with different endpoints
app.use('/api/v1', router)

router.use('/test', testRouter)
router.use('/users', usersRouter)
router.use('/recipes', recipesRouter)
// router.use('/ingredients', ingredientsRouter)
router.use('/categories', categoriesRouter)

export default app
import express from 'express'
import RecipesService from './../services/recipes.service.js'

const router = express.Router()
const service = new RecipesService()

// endpoints

router.get('/', async (req, res) => {
  // textMatch: string contained in recipe's name
  const { category, textMatch } = req.query
  
  const recipes = await service.get_recipes()

  res.status(200).json({
    category,
    textMatch,
    recipes
  })
})


router.get('/:id', async (req, res, next) => {
  const { id } = req.params
  
  try {
    const recipe = await service.get_recipe_by_id(id)
    res.status(200).json(recipe)
  } catch (err) {
    console.log('enter catch')
    next(err)
  }
})


router.post('/new', async (req, res) => {
  const body = req.body

  res.status(201).json({
    message: 'recipe info received',
    data: body
  })
})


router.put('/update/:id', async (req, res) => {
})


router.patch('/partialUpdate/:id', async (req, res) => {
  const { id } = req.params
  const body = req.body

  res.json({
    message: 'partial update',
    id,
    data: body
  })
})


router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params

  res.json({
    message: 'deleted',
    id
  })
})

export default router
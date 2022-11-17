import express from 'express'
import RecipesService from './../services/recipes.service.js'

const router = express.Router()
const service = new RecipesService()


// endpoints

// WIP get recipes by user
router.get('/', async (req, res) => {
  const { category, search_text } = req.query

  const filter = {}

  if (category){
    filter.category = category
  }
  
  if (search_text){
    filter.search_text = search_text
  } else {
    filter.search_text = ''
  }

  try {
    const recipes = await service.get_recipes(filter)
    res.status(200).json(recipes)
  } catch(err) {
    console.error(err)
  }
})


router.get('/:id', async (req, res, next) => {
  const { id } = req.params
  
  try {
    const recipe = await service.get_recipe_by_id(id)
    res.status(200).json(recipe)
  } catch (err) {
    console.error(err)
  }
})


// WIP schema validate
router.post('/new', async (req, res) => {
  const body = req.body

  await service.create(body)

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
import express from 'express'
import { log_error, error_handler } from '../middlewares/error.handler.js'
import RecipesService from './../services/recipes.service.js'

const router = express.Router()
const service = new RecipesService()


// endpoints
// WIP ALL get/post/patch/delete if logged

// WIP get by user with TOKEN received
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


// WIP get if creatorID and TOKEN coincide
router.get('/:id', error_handler, async (req, res) => {
  const { id } = req.params
  
  try {
    const recipe = await service.get_recipe_by_id(id)
    res.status(200).json(recipe)
  } catch (err) {
    log_error(err, req, res)
    error_handler(err, 404, req, res)
  }
})


// WIP post with creatorID from TOKEN
router.post('/new', async (req, res) => {
  try {
    const recipe = await service.create(req.body, '637bfe9621ee9e07bc6534d8')

    res.status(201).json({
      message: 'Recipe created',
      data: recipe
    })
  } catch(err) {
    res.status(400).json(err)
  }
})


// WIP update only for developtment (update all)
router.put('/update/:id', async (req, res) => {
  try {
    const recipe = await service.update(req.body)

    res.status(201).json({
      message: 'Recipe updated',
      data: recipe
    })
  } catch(err) {
    console.error(err)
    res.status(400).json({err})
  }
})


// WIP patch if creatorID and TOKEN coincide
router.patch('/partialUpdate/:id', async (req, res) => {
  const { id } = req.params
  const body = req.body

  res.json({
    message: 'partial update TEST',
    id,
    data: body
  })
})


// WIP delete if creatorID and TOKEN coincide
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params

  try {
    await service.delete(id)
    res.status(200).json({
      message: 'Recipe deleted',
      recipe_id: id
    })

  } catch(err) {
    log_error(err, req, res)
    error_handler(err, 404, req, res)
  }
})

export default router
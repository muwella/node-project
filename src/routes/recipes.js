import express from 'express'
import { log_error, error_handler } from '../middlewares/error.handler.js'
import RecipesService from './../services/recipes.service.js'
import jwt from 'jsonwebtoken'

const router = express.Router()
const service = new RecipesService()


// endpoints

// PRODUCTION

router.post('/new', async (req, res) => {
  try {
    const decoded = jwt.decode(req.headers.authorization)
    const recipe = await service.create(req.body, decoded.user_id)

    res.status(201).json({
      message: 'Recipe created',
      data: recipe
    })
  } catch(err) {
    res.status(400).json(err)
  }
})


router.get('/', async (req, res) => {
  const { category, search_text } = req.query
  const token = jwt.decode(req.headers.authorization)
  
  const filter_input = {
    'id': token.user_id
  }
  
  if (category){
    filter.category = category
  }
  
  if (search_text){
    filter_input.search_text = search_text
  } else { 
    filter_input.search_text = ''
  }

  const filter = await service.create_filter(filter_input)

  try {
    const recipes = await service.get_recipes(filter, token.user_id)
    res.status(200).json(recipes)
  } catch(err) {
    log_error(err, req, res)
    error_handler(err, 400, req, res)
  }
})


router.get('/suggestions', async (req, res) => {
  const token = jwt.decode(req.headers.authorization)
  
  try {
    const suggestions = await service.get_suggestions(token.user_id)
    res.status(200).json(suggestions)
  } catch (err) {
    log_error(err, req, res)
    error_handler(err, 404, req, res)
  }
})


router.get('/lastAdded', async (req, res) => {
  const token = jwt.decode(req.headers.authorization)
  
  try {
    const suggestions = await service.get_last_added(token.user_id)
    res.status(200).json(suggestions)
  } catch (err) {
    log_error(err, req, res)
    error_handler(err, 404, req, res)
  }
})


router.get('/:id', async (req, res) => {
  const { id } = req.params
  const token = jwt.decode(req.headers.authorization)

  if ( await service.isCreator(id, token.user_id) ) {
    try {
      const recipe = await service.get_recipe_by_id(id)
      res.status(200).json(recipe)
    } catch (err) {
      log_error(err, req, res)
      error_handler(err, 404, req, res)
    }
  } else {
    res.status(401)
  }
})


router.patch('/update/:id', async (req, res) => {
  const { id } = req.params
  const token = jwt.decode(req.headers.authorization)
  
  // update if the requester is the creator, otherwise 401 (Unauthorized)
  if ( await service.isCreator(id, token.user_id) ) {
    try {
      const recipe = await service.update(id, req.body)
      res.status(200).json(recipe)
    } catch(err) {
      log_error(err, req, res)
      error_handler(err, 404, req, res)
    }
  } else {
    res.status(401)
  }
})


router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params
  const token = jwt.decode(req.headers.authorization)

  // delete if the requester is the creator, otherwise 401 (Unauthorized)
  if ( await service.isCreator(id, token.user_id) ) {
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
  } else {
    res.status(401)
  }
})


// DEVELOPMENT

router.put('/updateAll', async (req, res) => {
  try {
    const recipes = await service.update_all(req.body)
    res.status(201).json(recipes)
  } catch(err) {
    log_error(err, req, res)
    error_handler(err, 404, req, res)
  }
})


router.delete('/deleteAll', async (req, res) => {
  try {
    const recipes = await service.delete_all(req.body)
    res.status(201).json(recipes)
  } catch(err) {
    log_error(err, req, res)
    error_handler(err, 404, req, res)
  }
})

export default router
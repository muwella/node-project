import express from 'express'
import { error_handler } from '../middlewares/error.handler.js'
import RecipeManager from './../services/recipes.manager.js'
import response from '../resources/response.js'

const router = express.Router()
const recipe_manager = new RecipeManager()

// PRODUCTION

// WIP syntax validator
// WIP missing credentials validator
// create recipe
router.post('/new', async (req, res) => {
  try {
    const token = res.locals.decoded
    const recipe = req.body
    recipe.creator_id = token.user_id

    const name_already_used = await recipe_manager.get_recipe_by_name(recipe.name)
    if (name_already_used) {
      return response(res, 400, 'Recipe name already in use', null)
    }

    await recipe_manager.create(recipe)

    const recipeDB = await recipe_manager.get_recipe_by_name(recipe.name)
    response(res, 201, 'Recipe created', recipeDB)

  } catch(err) {
    error_handler(err, 400, req, res)
  }
})


// get recipes w/query
router.get('/', async (req, res) => {
  try {
    const token = res.locals.decoded
    
    const filter = recipe_manager.create_filter(req.query, token.user_id)

    const recipes = await recipe_manager.get_recipes(filter)

    response(res, 200, 'Recipes received', recipes)

  } catch (err) {
    error_handler(err, 400, req, res)
  }
})


// get recipe suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const token = res.locals.decoded

    const recipes = await recipe_manager.get_suggestions(token.user_id)
    
    response(res, 200, 'Recipe suggestions received', recipes)
    
  } catch (err) {
    error_handler(err, 404, req, res)
  }
})


// get 3 last added recipes
router.get('/lastAdded', async (req, res) => {
  try {
    const token = res.locals.decoded

    const recipes = await recipe_manager.get_last_added(token.user_id)
    
    response(res, 200, 'Three last added recipes received', recipes)

  } catch (err) {
    error_handler(err, 404, req, res)
  }
})


// get recipe
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const token = res.locals.decoded

    const recipe = await recipe_manager.get_recipe_by_id(id)

    if (!recipe) {
      return response(res, 404, 'Recipe not found', null)
    }

    if (recipe.creator_id != token.user_id) {
      return response(res, 403, 'You don\'t have permission to access this resource', null)
    }
    
    return response(res, 200, 'Recipe received', recipe)

  } catch (err) {
    error_handler(err, 400, req, res)
  }
})


// update recipe
router.patch('/update/:id', async (req, res) => {
  try {
    const token = res.locals.decoded
    const id = req.params.id
    const change = req.body

    let recipe = await recipe_manager.get_recipe_by_id(id)

    if (!recipe) {
      return response(res, 404, 'Recipe not found', null)
    }

    if (recipe.creator_id != token.user_id) {
      return response(res, 403, 'You don\'t have permission to access this resource', null)
    }

    await recipe_manager.update(id, change)
    recipe = await recipe_manager.get_recipe_by_id(id)

    response(res, 200, 'Recipe updated', recipe)

  } catch (err) {
    error_handler(err, 400, req, res)
  }
})


// delete recipe
router.delete('/delete/:id', async (req, res) => {
  try {
    const token = res.locals.decoded
    const id = req.params.id

    const recipe = await recipe_manager.get_recipe_by_id(id)

    if (!recipe) {
      return response(res, 404, 'Recipe not found', null)
    }

    if (recipe.creator_id != token.user_id) {
      return response(res, 403, 'You don\'t have permission to access this resource', null)
    }
    
    await recipe_manager.delete(id)
    
    return response(res, 200, 'Recipe deleted', recipe)

  } catch (err) {
    error_handler(err, 400, req, res)
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
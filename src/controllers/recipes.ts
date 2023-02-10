import express from 'express'
import { log_error, error_handler } from '../middlewares/error.handler.js'
import { response } from '../resources/response.js'
import RecipeManager from '../services/recipes.manager.js'
import CategoryManager from '../services/categories.manager.js'
import isEmpty from 'is-empty'
import categories from '../models/categories.js'
import { Types } from 'mongoose'
import { RecipeInCreate, RecipeInDB } from '../types/recipe.js'

const router = express.Router()
const recipe_manager = new RecipeManager()
const category_manager = new CategoryManager()

// PRODUCTION

// create recipe
router.post('/new', async (req, res) => {
  try {
    const user_id = res.locals.user_id
    const recipe: RecipeInCreate = req.body

    // check name existence
    if (!recipe.name) {
      return response(res, 400, 'MISSING_VALUE_NAME', null)
    }

    const name_available = await recipe_manager.check_name_availability(user_id, recipe.name)
    if (!name_available) {
      return response(res, 400, 'RECIPE_NAME_ALREADY_USED', null)
    }
    
    const syntax_success = await recipe_manager.check_name_syntax(recipe.name)
    if (!syntax_success) { 
      return response(res, 400, 'INVALID_SYNTAX', recipe.name)
    }
    
    // if recipe has at least one category
    if (recipe.categories) {
      const check_categories = await category_manager.check_categories_existence(user_id, recipe.categories)
      
      // if any category ID does not match with user categories
      if (!check_categories.categories_exist) {
        return response(res, 404, 'CATEGORY_DOES_NOT_EXIST', check_categories.categories_not_found)
      }
    }

    await recipe_manager.create(recipe, user_id)

    const recipeDB = await recipe_manager.get_recipe_by_name(recipe.name)
    response(res, 201, 'Recipe created', recipeDB)

  } catch(err) {
    error_handler(err, 400, req, res, null)
  }
})


// get recipes w/query
router.get('/', async (req, res) => {
  try {
    const token = res.locals.decoded

    // FIXME req.query
    // https://stackoverflow.com/questions/63579867/what-does-this-error-say-type-parsedqs-is-not-assignable-to-type-string
    const filter = recipe_manager.create_filter(req.query, token.user_id)

    const recipes = await recipe_manager.get_recipes(filter)

    response(res, 200, 'Recipes received', recipes)

  } catch (err) {
    error_handler(err, 400, req, res, null)
  }
})


// get recipe suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const token = res.locals.decoded

    const recipes = await recipe_manager.get_suggestions(token.user_id)
    
    response(res, 200, 'Recipe suggestions received', recipes)
    
  } catch (err) {
    error_handler(err, 404, req, res, null)
  }
})


// get 3 last added recipes
router.get('/lastAdded', async (req, res) => {
  try {
    const token = res.locals.decoded

    const recipes = await recipe_manager.get_last_added(token.user_id)
    
    response(res, 200, 'Three last added recipes received', recipes)

  } catch (err) {
    error_handler(err, 404, req, res, null)
  }
})


// get recipe
router.get('/:id', async (req, res) => {
  try {
    const id: Types.ObjectId = res.locals.decoded.user_id
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
    error_handler(err, 400, req, res, null)
  }
})


// update recipe
router.patch('/update/:id', async (req, res) => {
  try {
    const token = res.locals.decoded
    const id: Types.ObjectId = res.locals.decoded.user_id
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
    error_handler(err, 400, req, res, null)
  }
})


// delete recipe
router.delete('/delete/:id', async (req, res) => {
  try {
    const token = res.locals.decoded
    const id: Types.ObjectId = res.locals.decoded.user_id

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
    error_handler(err, 400, req, res, null)
  }
})


// DEVELOPMENT

router.put('/updateAll', async (req, res) => {
  try {
    const recipes = await recipe_manager.update_all(req.body)
    res.status(201).json(recipes)
  } catch(err) {
    log_error(err)
  }
})


router.delete('/deleteAll', async (req, res) => {
  try {
    const recipes = await recipe_manager.delete_all(req.body)
    res.status(201).json(recipes)
  } catch(err) {
    log_error(err)
  }
})

export default router
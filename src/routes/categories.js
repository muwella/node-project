import express from 'express'
import { error_handler } from '../middlewares/error.handler.js'
import CategoryManager from '../services/categories.manager.js'
import response from '../resources/response.js'
import isEmpty from 'is-empty'

const router = express.Router()
const category_manager = new CategoryManager()

// PRODUCTION

// create category
router.post('/new', async (req, res) => {
  try {
    const token = res.locals.decoded
    const category = req.body
    category.creator_id = token.user_id

    const name_already_used = await category_manager.get_category_by_name(category.name)
    if (name_already_used) {
      return response(res, 400, 'Category name already in use', null)
    }

    await category_manager.create(category)

    const categoryDB = await category_manager.get_category_by_name(category.name)
    response(res, 201, 'Category created', categoryDB)

  } catch(err) {
    error_handler(err, 400, req, res)
  }
})


// get categories
router.get('/', async (req, res) => {
  try {
    const token = res.locals.decoded
  
    const categories = await category_manager.get_categories(token.user_id)
  
    response(res, 200, 'Categories received', categories)

  } catch(err) {
    error_handler(err, 400, req, res)
  }
})


// update category
router.patch('/update/:id', async (req, res) => {
  try {
    const { id } = req.params.id
    const change = req.body
    
    // WIP chequear que el usuario sea dueño de la categoria
      // que esta queriendo actualizar
    const token = res.locals.decoded
  
    const categories = await category_manager.update(id, change)
  
    response(res, 200, 'Categories received', categories)

  } catch(err) {
    error_handler(err, 400, req, res)
  }
})


// delete category
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params

  res.json({
    message: 'deleted',
    id
  })
})


// DEVELOPMENT

router.patch('/updateAll', async (req, res) => {
  const { id } = req.params
  const body = req.body

  res.json({
    message: 'partial update',
    id,
    data: body
  })
})



export default router
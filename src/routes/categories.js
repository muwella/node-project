import express from 'express'
import CategoriesService from './../services/categories.service.js'
import empty from 'is-empty'

const router = express.Router()
const service = new CategoriesService()


// endpoints

router.get('/', async (req, res) => {
  const categories = await service.get_categories()

  res.status(200).json({categories})
})


router.get('/:id', async (req, res) => {
  const { id } = req.params
  
  const category = await service.get_category_by_id(id)

  if (empty(category)) {
    res.status(404).json({
      message: "category not found"
    })
  } else {
    res.status(200).json(category)
  }
})


router.post('/new', async (req, res) => {
  const body = req.body

  res.status(201).json({
    message: 'category info received',
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
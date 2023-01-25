import express from 'express'
import IngredientsService from './../services/ingredients.service.js'
import empty from 'is-empty'

// const router = express.Router()
// const service = new IngredientsService()


// endpoints

// router.get('/', async (req, res) => {
//   const ingredients = await service.get_ingredients()

//   res.status(200).json({ingredients})
// })


// router.get('/:id', async (req, res) => {
//   const { id } = req.params
  
//   const ingredient = await service.get_ingredient_by_id(id)

//   if (empty(ingredient)) {
//     res.status(404).json({
//       message: "ingredient not found"
//     })
//   } else {
//     res.status(200).json(ingredient)
//   }
// })


// router.post('/new', async (req, res) => {
//   const body = req.body

//   res.status(201).json({
//     message: 'ingredient info received',
//     data: body
//   })
// })


// router.put('/update/:id', async (req, res) => {
// })


// router.patch('/partialUpdate/:id', async (req, res) => {
//   const { id } = req.params
//   const body = req.body

//   res.json({
//     message: 'partial update',
//     id,
//     data: body
//   })
// })


// router.delete('/delete/:id', async (req, res) => {
//   const { id } = req.params

//   res.json({
//     message: 'deleted',
//     id
//   })
// })

// export default router
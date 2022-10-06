const express = require('express')

const router = express.Router()

const recipe = {
  id: 54827,
  name: 'pizza',
  ingredients: [
    {
      name: 'ingredient1'
    },
    {
      name: 'ingredient2'
    },
    {
      name: 'ingredient3'
    }
  ],
  creation_date: 'creation date',
  update_date: 'update date',
  category: [
    'dulce',
    'salado',
    'fiestas'
  ]
}

// endpoints

// EXAMPLE query
router.get('/', (req, res) => {
  const { category, textMatch } = req.query
  
  // search on DB with category and textMatch filters
  // e.g. textMatch = 'oli' gets 'alioli sauce' and 'ravioli'
  // as long as those two also match with the category
  res.json([
    category,
    textMatch
  ])
})


// EXAMPLE parameter
router.get('/:id', (req, res) => {
  const { id } = req.params

  // search in DB for recipe with id
  res.json({
    id,
    recipe
  })
})


// EXAMPLE to get 2 parameters on the same endpoint
router.get('/:categoryID/recipe/:recipeID', (req, res) => {
  const { categoryID, recipeID } = req.params

  res.json({
    categoryID,
    recipeID
  })
})


module.exports = router
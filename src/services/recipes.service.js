import models from '../models/index.js'
import { faker } from '@faker-js/faker'
import empty from 'is-empty'


// recipes management
class RecipesService {
  constructor() {
    // this.generate()
  }

  async generate() {
    const limit = 1
    
    for (let i = 0; i < limit; i++) {
      const category = await models.CategoryModel.findOne({name: 'Dessert'})
      
      const recipe = new models.RecipeModel({
        name: faker.random.words(),
        ingredients: [
          faker.random.words(1), 
          faker.random.words(1), 
          faker.random.words(1)],
        category: category,
        creation_date: faker.date.past(),
        update_date: faker.date.recent(),
      })
      
      await recipe.save()
    }
  }

  async create(body) {
    const recipe = {
      ...body,
      creatorID: '637bfe9621ee9e07bc6534d8'
    }
    const recipeInDB = await new models.RecipeModel(recipe).save()
    return recipeInDB
  }

  async get_recipes(filter_input) {
    // create filter
    const filter = {
      name: { $regex: filter_input.search_text, $options: 'i' }
    }

    if (filter_input.category) {
      filter.category = filter_input.category
    }

    return await models.RecipeModel.find(filter)
  }

  async get_recipe_by_id(id) {
    const recipe = await models.RecipeModel.findById(id)

    if ( empty(recipe) ) {
      throw new Error('Recipe not found')
    } else {
      return recipe
    }
  }

  async update(id) {
    const recipe = await models.RecipeModel.findByIdAndUpdate(id)
    return recipe
  }

  async partial_update() {

  }

  async delete(id) {
    await models.RecipeModel.findByIdAndDelete(id)
  }
}

export default RecipesService
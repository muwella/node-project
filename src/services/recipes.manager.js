import models from '../models/index.js'
import { faker } from '@faker-js/faker'
import empty from 'is-empty'

// recipes management
class RecipeService {
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
      
      // await recipe.save()
    }
  }

  // async isCreator(recipe_id, user_id) {
  //   try {
  //     const recipe = await this.get_recipe_by_id(recipe_id)
  //     return recipe.creator == user_id
  //   } catch(err) {
  //     throw new Error('Recipe not found')
  //   }
  // }
  
  async create(recipe) {
    return await new models.RecipeModel(recipe).save()
  }

  create_filter(query, id) {
    const filter = {
      'creator_id': id
    }

    if (query.category){
      filter.category = category
    }
    
    if (query.search_text){
      filter.name = { $regex: query.search_text, $options: 'i' }
    }
  
    return filter
  }

  async get_recipes(filter) {
    return await models.RecipeModel.find(filter)
  }

  // NOTE for user_id + recipe.name case
  async get_recipe(filter) {
    return await models.RecipeModel.findOne(filter)
  }

  async get_recipe_by_id(id) {
    return await models.RecipeModel.findById(id)
  }

  async get_recipe_by_name(name) {
    return await models.RecipeModel.findOne({name: name})
  }

  get_random_recipe(recipes) {
    return recipes[Math.floor(Math.random()*recipes.length)]
  }

  async get_suggestions(id) {
    const recipes = await this.get_recipes({'creator': id})
    const suggestions = []
    
    if (recipes.length <= 3) {
      return recipes
    } else {
      const min = Math.min(recipes.length, 3)

      for(let i = 0; i < min; i++) {
        const random_recipe = this.get_random_recipe(recipes)
        suggestions.push(random_recipe);
        
        const index = recipes.indexOf(random_recipe)
        if (index !== -1) {
          recipes.splice(index, 1);
        }
      }

      return suggestions
    }
  }

  async get_last_added(id) {
    return models.RecipeModel.find({creator: id}).sort({'creation_date': -1}).limit(3)
  }

  async update(id, change) {
    await models.RecipeModel.findByIdAndUpdate(id, change)
    return await this.get_recipe_by_id(id)
  }

  async update_all() {

  }

  async delete_category_from_recipes(id) {
    const recipes = await this.get_recipes({category: id})

    for (const recipe of recipes) {
      const index = recipe.category.indexOf(id)
      recipe.category.splice(index, 1)
      this.update(recipe._id, {category: recipe.category})
    }
  }

  async delete(id) {
    await models.RecipeModel.findByIdAndDelete(id)
  }
}

export default RecipeService
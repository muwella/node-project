import models from '../models/index.js'
import { faker } from '@faker-js/faker'
import { RecipeInCreate, RecipeInDB, RecipeInUpdate } from '../types/recipe.js'
import { Types } from 'mongoose'

interface RecipeQuery {
  categories: Types.ObjectId[] | null,
  search_text: string
}

interface RecipeFilter {
  creator_id: Types.ObjectId,
  categories?: Types.ObjectId[] | null,
  name?: object
}

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

  // returns True if name available
  async check_name_availability(user_id: string, name: string): Promise<Boolean> {
    const user_recipes = await this.get_recipes({creator_id: user_id})
    return !user_recipes.some(recipe => recipe.name == name)

    // return await models.RecipeModel.find({
    //   creator_id: user_id,
    //   name: name
    // })
  }
  
  async check_name_syntax(name: string) {
    const regex = new RegExp("^[A-Za-z0-9_.,! ]+$")
    return regex.test(name)
  }
  
  async create(recipe: RecipeInCreate) {
    return await new models.RecipeModel(recipe).save()
  }

  create_filter(query: RecipeQuery, id: Types.ObjectId) {
    const filter: RecipeFilter = {
      'creator_id': id,
    }
    
    if (query.categories){
      filter.categories = query.categories
    }
    
    if (query.search_text){
      filter.name = { $regex: query.search_text, $options: 'i' }
    }
  
    return filter
  }

  async get_recipes(filter: object): Promise<RecipeInDB[]> {
    return await models.RecipeModel.find(filter)
  }

  // NOTE for user_id + recipe.name case
  async get_recipe(filter: object) {
    return await models.RecipeModel.findOne(filter)
  }

  async get_recipe_by_id(id: Types.ObjectId) {
    return await models.RecipeModel.findById(id)
  }

  async get_recipe_by_name(name: string) {
    return await models.RecipeModel.findOne({name: name})
  }

  get_random_recipe(recipes: RecipeInDB[]): RecipeInDB {
    return recipes[Math.floor(Math.random()*recipes.length)]
  }

  async get_suggestions(id: string) {
    const recipes = await this.get_recipes({'creator': id})
    const suggestions: RecipeInDB[] = []
    
    if (recipes.length <= 3) {
      return recipes
    } else if (recipes.length > 3) {
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
    } else if (recipes.length == 0) {
      throw new Error('RECIPES_NOT_FOUND')
    }
  }

  async get_last_added(id: string) {
    return models.RecipeModel.find({creator: id}).sort({'creation_date': -1}).limit(3)
  }

  // WIP revise change type
  async update(id: Types.ObjectId, change: object) {
    await models.RecipeModel.findByIdAndUpdate(id, change)
    return await this.get_recipe_by_id(id)
  }

  // WIP categories are personal?
    // in that case, delete_category_from_recipes should receive
    // user_id, get all of their recipes, and then search for the ones that
    // do have that category and delete it from the recipe
  async delete_category_from_recipes(user_id: Types.ObjectId, category_id: Types.ObjectId) {
    const recipes = await this.get_recipes({ _id: user_id })

    for (const recipe of recipes) {
      // if the recipe has any category, search for the one that is being deleted
      if (recipe.categories) {
        const index = recipe.categories.indexOf(category_id)

        if (index == -1) continue
        else {
          recipe.categories.splice(index, 1)
          this.update(recipe.id, {categories: recipe.categories})
        }
      }
  
    }
  }

  async delete(id: Types.ObjectId) {
    await models.RecipeModel.findByIdAndDelete(id)
  }

  // DEVELOPMENT
  
  async update_all(body: unknown) {

  }

  async delete_all(body: unknown) {

  }
}

export default RecipeService
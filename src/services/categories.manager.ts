import isEmpty from 'is-empty'
import models from '../models/index.js'
import { Types } from 'mongoose'
import { CategoryInCreate } from '../types/category.js'

// categories management
class CategoryManager {
  constructor() {
    // this.generate()
  }

  async generate() {
    const meals = new models.CategoryModel({
       name: 'Meals',
       creator_id: 'smth'
    })
    const dessert = new models.CategoryModel({
      name: 'Dessert',
      creator_id: 'smth'
    })
    
    // await meals.save()
    // await dessert.save()
  }

  // WIP IIRC categories is of type string[]
  async check_categories_existence(user_id: Types.ObjectId, categories: Types.ObjectId[]) {
    const not_found = []
    
    for (const category of categories) {
      const found = await this.get_category_by_id(category)
      if (!found || found.creator_id != user_id) {
        not_found.push(category)
      }
    }
    
    // WIP declaring categories_exist as true but i want it just to be boolean, not have a value
    const obj = {
      categories_not_found: not_found,
      categories_exist: true
    }
    
    if (isEmpty(not_found)) {
      obj.categories_exist = true
      return obj
    } else {
      obj.categories_exist = false
      return obj      
    }
  }

  // returns True if name available
  async check_name_availability(id: string, name: string) {
    const user_categories = await this.get_categories(id)
    return !user_categories.some(category => category.name == name)
  }
  
  // test and replace name_already_used with this function
  // async check_name_availability(user_id, name) {
  //   return await models.CategoryModel.find({
  //     creator_id: user_id,
  //     name: name
  //   })
  // }

  check_name_syntax(name: string) {
    const regex = new RegExp("^[A-Za-z0-9_.,! ]+$")
    return regex.test(name)
  }

  // async check_categories_existence(user_id, categories) {
  //   const user_categories = await this.get_categories(user_id)

  //   // for every category in new recipe
  //     // check category on user DB
  //   for (id in categories) {
  //     const found = user_categories.includes(id)
      
  //   }
  // }
  
  // WIP missing category interfaces
  async create(category: CategoryInCreate) {
    return await new models.CategoryModel(category).save()
  }

  async get_categories(user_id: string) {
    return await models.CategoryModel.find({creator_id: user_id})
  }
  
  async get_category_by_id(id: Types.ObjectId) {
    return await models.CategoryModel.findById(id)
  }
  
  async get_category_by_name(name: string) {
    return await models.CategoryModel.findOne({name: name})
  }

  async get_category_by_name_and_user_id(user_id: string, name: string) {
    return await models.CategoryModel.findOne({name: name, creator_id: user_id})
  }

  // NOTE only possible change is name
  async update(id: Types.ObjectId, change: object) {
    change = {
      ...change,
      update_date: Date.now()
    }

    return await models.CategoryModel.findByIdAndUpdate(id, change, { runValidators: true })
  }

  async delete(id: Types.ObjectId) {
    return await models.CategoryModel.findByIdAndDelete(id)
  }
}

export default CategoryManager
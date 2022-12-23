import isEmpty from 'is-empty'
import models from '../models/index.js'

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

  async check_categories_existence(user_id, categories) {
    const not_found = []
    
    for (const category of categories) {
      const found = await this.get_category_by_id(category)
      if (!found) {
        not_found.push(category)
      }
    }
    
    const obj = {
      categories_not_found: not_found 
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
  async check_name_availability(id, name) {
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

  check_name_syntax(name) {
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
  
  async create(category) {
    return await new models.CategoryModel(category).save()
  }

  async get_categories(user_id) {
    return await models.CategoryModel.find({creator_id: user_id})
  }
  
  async get_category_by_id(id) {
    return await models.CategoryModel.findById(id)
  }
  
  async get_category_by_name(name) {
    return await models.CategoryModel.findOne({name: name})
  }

  // NOTE only possible change is name
  async update(id, change) {
    change = {
      ...change,
      update_date: Date.now()
    }

    return await models.CategoryModel.findByIdAndUpdate(id, change, { runValidators: true })
  }

  async delete(id) {
    return await models.CategoryModel.findByIdAndDelete(id)
  }
}

export default CategoryManager
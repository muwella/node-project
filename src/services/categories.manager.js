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

  async name_already_used(id, name) {
    const user_categories = await this.get_categories(id)
    return user_categories.some(category => category.name == name)
  }

  check_name_syntax(name) {
    const regex = new RegExp("^[A-Za-z0-9_.,! ]+$")
    return regex.test(name)
  }

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
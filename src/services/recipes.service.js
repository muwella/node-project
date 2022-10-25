import empty from 'is-empty'
import { faker } from '@faker-js/faker'


// recipes management
class RecipesService {
  constructor() {
    // for learning purposes
    this.ingredients = []
    this.categories = []
    this.recipes = [] // mi """base de datos"""
    this.generate()
  }

  async generate() {
    // generate 100 recipes
    const limit = 20

    for (let i = 0; i < limit; i++) {  
      // generate ingredients & categories list
      for (let j = 0; j < 3; j++) {
        this.ingredients.push({
          name: faker.random.word(),
          image: faker.image.food()
        })

        this.categories.push({
          name: faker.random.word()
        })
      }

      // generate recipe
      this.recipes.push({
        id: faker.datatype.uuid(),
        name: faker.random.words(),
        image: faker.image.food(),
        ingredients: this.ingredients,
        categories: this.categories,
        creation_date: faker.date.past(),
        update_date: faker.date.recent(),
      })

      this.ingredients = []
      this.categories = []
    }
  }

  async create() {

  }

  async get_recipes(category, textMatch) {
    // search on DB with category and textMatch filters
    // e.g. textMatch = 'oli' gets 'alioli sauce' and 'ravioli'
    // as long as those two also match with the category
  
    return this.recipes
  }

  async get_categories() {
    return this.categories
  }

  async get_recipe_by_id(id) {
    const recipe = this.recipes.find(item => item.id == id)

    // explicit error
    const name = this.getTotal()
    
    if (empty(recipe)) {
      throw new Error('recipe not found')
    } else {
      return recipe
    }
  }
  
  async filter_recipes_by_category(categoryID) {
    return this.recipes.filter(item => item.categoryID == categoryID)
  }

  async filter_recipes_by_string(string) {
    return this.recipes.filter(item = item.name.contains(string))
  }

  async update() {

  }

  async delete() {

  }
}

export default RecipesService
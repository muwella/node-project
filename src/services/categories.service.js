import models from '../models/index.js'
import empty from 'is-empty'
import { faker } from '@faker-js/faker'
import mongoose, { Schema } from 'mongoose'


// categories management
class CategoriesService {
  constructor() {
    this.generate()
  }

  // WIP Uncategorized category, created by Manager user
  async generate() {
    // const meals = new models.CategoryModel({name: 'Meals'})
    // const dessert = new models.CategoryModel({name: 'Dessert'})
    // await meals.save()
    // await dessert.save()
  }

  async create() {
  }

  async get_categories() {
  }

  async get_category_by_id(id) {
  }
  
  async update() {
  }

  async delete() {
  }
}

export default CategoriesService
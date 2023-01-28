import models from '../models/index.js';
import { faker } from '@faker-js/faker';
// recipes management
class RecipeService {
    constructor() {
        // this.generate()
    }
    async generate() {
        const limit = 1;
        for (let i = 0; i < limit; i++) {
            const category = await models.CategoryModel.findOne({ name: 'Dessert' });
            const recipe = new models.RecipeModel({
                name: faker.random.words(),
                ingredients: [
                    faker.random.words(1),
                    faker.random.words(1),
                    faker.random.words(1)
                ],
                category: category,
                creation_date: faker.date.past(),
                update_date: faker.date.recent(),
            });
            // await recipe.save()
        }
    }
    // returns True if name available
    async check_name_availability(user_id, name) {
        const user_recipes = await this.get_recipes({ creator_id: user_id });
        return !user_recipes.some(recipe => recipe.name == name);
        // return await models.RecipeModel.find({
        //   creator_id: user_id,
        //   name: name
        // })
    }
    async check_name_syntax(name) {
        const regex = new RegExp("^[A-Za-z0-9_.,! ]+$");
        return regex.test(name);
    }
    // WIP missing recipe interfaces
    async create(recipe) {
        return await new models.RecipeModel(recipe).save();
    }
    // WIP define Query object
    create_filter(query, id) {
        const filter = {
            'creator_id': id
        };
        if (query.category) {
            filter.category = category;
        }
        if (query.search_text) {
            filter.name = { $regex: query.search_text, $options: 'i' };
        }
        return filter;
    }
    // WIP idk what it returns, Promise<Document[] | null>? Promise<Query | null>?
    async get_recipes(filter) {
        return await models.RecipeModel.find(filter);
    }
    // NOTE for user_id + recipe.name case
    async get_recipe(filter) {
        return await models.RecipeModel.findOne(filter);
    }
    async get_recipe_by_id(id) {
        return await models.RecipeModel.findById(id);
    }
    async get_recipe_by_name(name) {
        return await models.RecipeModel.findOne({ name: name });
    }
    // WIP define recipe interfaces, recipes type should be Recipe[] and function return a Recipe
    get_random_recipe(recipes) {
        return recipes[Math.floor(Math.random() * recipes.length)];
    }
    async get_suggestions(id) {
        const recipes = await this.get_recipes({ 'creator': id });
        const suggestions = [];
        if (recipes.length <= 3) {
            return recipes;
        }
        else if (recipes.length > 3) {
            const min = Math.min(recipes.length, 3);
            for (let i = 0; i < min; i++) {
                const random_recipe = this.get_random_recipe(recipes);
                suggestions.push(random_recipe);
                // WIP idek at this point
                const index = recipes.indexOf(random_recipe);
                if (index !== -1) {
                    recipes.splice(index, 1);
                }
            }
            return suggestions;
        }
        else if (recipes.length == 0) {
            throw new Error('RECIPES_NOT_FOUND');
        }
    }
    async get_last_added(id) {
        return models.RecipeModel.find({ creator: id }).sort({ 'creation_date': -1 }).limit(3);
    }
    // WIP revise change type
    async update(id, change) {
        await models.RecipeModel.findByIdAndUpdate(id, change);
        return await this.get_recipe_by_id(id);
    }
    async update_all() {
    }
    async delete_category_from_recipes(id) {
        const recipes = await this.get_recipes({ category: id });
        for (const recipe of recipes) {
            const index = recipe.categories.indexOf(id);
            recipe.categories.splice(index, 1);
            this.update(recipe._id, { categories: recipe.categories });
        }
    }
    async delete(id) {
        await models.RecipeModel.findByIdAndDelete(id);
    }
}
export default RecipeService;

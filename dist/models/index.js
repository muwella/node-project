import { Schema, model } from 'mongoose';
import user from './users.js';
import recipe from './recipes.js';
// import ingredient from './ingredients.js'
import category from './categories.js';
const UserSchema = new Schema(user);
const RecipeSchema = new Schema(recipe);
const CategorySchema = new Schema(category);
// const IngredientSchema = new Schema(ingredient)
export default {
    UserModel: model('User', UserSchema),
    RecipeModel: model('Recipe', RecipeSchema),
    CategoryModel: model('Category', CategorySchema)
    // IngredientModel: model('Ingredient', IngredientSchema)
};

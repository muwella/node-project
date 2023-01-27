import { Schema, model } from 'mongoose';
import user from './users.js';
import recipe from './recipes.js';
// import ingredient from './ingredients.js'
import category from './categories.js';
const UserSchema = new Schema(user);
const RecipeSchema = new Schema(recipe);
// const IngredientSchema = new Schema(ingredient)
const CategorySchema = new Schema(category);
export default {
    RecipeModel: model('Recipe', RecipeSchema),
    UserModel: model('User', UserSchema),
    // IngredientModel: model('Ingredient', IngredientSchema)
    CategoryModel: model('Category', CategorySchema)
};

import express from 'express';
import { error_handler } from '../middlewares/error.handler.js';
import CategoryManager from '../services/categories.manager.js';
import RecipeManager from '../services/recipes.manager.js';
import { response } from '../resources/response.js';
import { Types } from 'mongoose';
const router = express.Router();
const category_manager = new CategoryManager();
const recipe_manager = new RecipeManager();
// PRODUCTION
// create category
router.post('/new', async (req, res) => {
    try {
        const user_id = res.locals.user_id;
        const category = req.body;
        category.creator_id = user_id;
        if (!category.name) {
            return response(res, 400, 'MISSING_VALUE_NAME', null);
        }
        const name_available = await category_manager.check_name_availability(user_id, category.name);
        if (!name_available) {
            return response(res, 400, 'CATEGORY_NAME_ALREADY_USED', null);
        }
        const syntax_success = await category_manager.check_name_syntax(category.name);
        if (!syntax_success) {
            return response(res, 400, 'INVALID_SYNTAX', category.name);
        }
        await category_manager.create(category);
        const categoryDB = await category_manager.get_category_by_name_and_user_id(user_id, category.name);
        response(res, 201, 'Category created', categoryDB);
    }
    catch (err) {
        error_handler(err, 400, req, res, null);
    }
});
// get categories
router.get('/', async (req, res) => {
    try {
        const token = res.locals.decoded;
        const categories = await category_manager.get_categories(token.user_id);
        response(res, 200, 'Categories received', categories);
    }
    catch (err) {
        error_handler(err, 400, req, res, null);
    }
});
// update category
router.patch('/update/:id', async (req, res) => {
    try {
        const token = res.locals.decoded;
        const id = new Types.ObjectId(req.params.id);
        const change = req.body;
        let category = await category_manager.get_category_by_id(id);
        if (!category) {
            return response(res, 404, 'Category not found', null);
        }
        const syntax_success = await category_manager.check_name_syntax(change.name);
        if (!syntax_success) {
            return response(res, 400, 'Invalid category name', null);
        }
        if (category.creator_id != token.user_id) {
            return response(res, 403, 'You don\'t have permission to access this resource', null);
        }
        await category_manager.update(id, change);
        category = await category_manager.get_category_by_id(id);
        response(res, 200, 'Category updated', category);
    }
    catch (err) {
        error_handler(err, 400, req, res, null);
    }
});
// delete category
router.delete('/delete/:category_id', async (req, res) => {
    try {
        const user_id = res.locals.decoded.user_id;
        const category_id = new Types.ObjectId(req.params.category_id);
        const category = await category_manager.get_category_by_id(category_id);
        console.log(category);
        if (!category) {
            return response(res, 404, 'Category not found', null);
        }
        if (category.creator_id != user_id) {
            return response(res, 403, 'PERMISSION_DENIED', 'You don\'t have permission to access this resource');
        }
        await recipe_manager.delete_category_from_recipes(user_id, category_id);
        await category_manager.delete(category_id);
        return response(res, 200, 'Category deleted', category);
    }
    catch (err) {
        error_handler(err, 400, req, res, null);
    }
});
// DEVELOPMENT
router.patch('/updateAll', async (req, res) => {
    const body = req.body;
    res.json({
        message: 'partial update',
        data: body
    });
});
export default router;

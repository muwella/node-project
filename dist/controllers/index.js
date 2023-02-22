import express from 'express';
import users_router from './users.js';
import recipes_router from './recipes.js';
import categories_router from './categories.js';
import planning_router from './planning.js';
// import ingredientsRouter from './ingredients.js' // api/v2
const app = express();
const router = express.Router();
// there can be several versions with different endpoints
app.use('/api/v1', router);
router.use('/users', users_router);
router.use('/recipes', recipes_router);
router.use('/categories', categories_router);
router.use('/planning', planning_router);
export default app;

const express = require('express');

const router = express.Router();
const MealPlanController = require('../controllers/mealPlan.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.post('/', MealPlanController.createMealPlan);
router.get('/:planId', MealPlanController.getMealPlan);
router.post('/:planId/recipes', MealPlanController.scheduleRecipe);
router.get('/:planId/shopping-list', MealPlanController.generateShoppingList);
router.get('/:planId/nutrition', MealPlanController.getNutritionSummary);

module.exports = router;
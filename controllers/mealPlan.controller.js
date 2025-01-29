const MealPlanService = require('../services/mealPlan.service');

class MealPlanController {
  
  async createMealPlan(req, res) {
    try {
      const mealPlan = await MealPlanService.createMealPlan({
        ...req.body,
        userId: req.user.id
      });
      res.status(201).json(mealPlan);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async scheduleRecipe(req, res) {
    try {
      const { planId } = req.params;
      const mealPlan = await MealPlanService.scheduleRecipe(planId, req.body);
      res.json(mealPlan);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

    async getMealPlan(req, res) {
    try {
      const { planId } = req.params;
      const mealPlan = await MealPlanService.getMealPlan(planId, req.user.id);
      
      if (!mealPlan) {
        return res.status(404).json({ error: 'Meal plan not found' });
      }
      
      res.json(mealPlan);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async generateShoppingList(req, res) {
    try {
      const { planId } = req.params;
      const shoppingList = await MealPlanService.generateShoppingList(planId);
      res.json(shoppingList);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getNutritionSummary(req, res) {
    try {
      const { planId } = req.params;
      const nutritionSummary = await MealPlanService.getNutritionSummary(planId);
      
      if (!nutritionSummary) {
        return res.status(404).json({ error: 'Nutrition summary not found' });
      }
      
      res.json(nutritionSummary);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async createRecipe(req, res) {
    try {
      const { 
        name, 
        description, 
        ingredients, 
        instructions, 
        servings,
        nutrition
      } = req.body;

      const recipe = new Recipe({
        name,
        description,
        ingredients,
        instructions,
        servings,
        nutrition,
        createdBy: req.user.id // Assuming authenticated user
      });

      const savedRecipe = await recipe.save();
      res.status(201).json(savedRecipe);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}



module.exports = new MealPlanController();
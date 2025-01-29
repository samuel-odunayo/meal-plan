const mongoose = require('mongoose');

const shoppingListSchema = new mongoose.Schema({
    mealPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MealPlan',
      required: true
    },
    items: [{
      ingredient: {
        name: String,
        category: String,
        storeSection: String
      },
      amount: Number,
      unit: String,
      substitutes: [{
        name: String,
        amount: Number,
        unit: String
      }]
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
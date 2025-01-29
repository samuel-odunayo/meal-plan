const express = require('express');
const connectDB = require('./config/db.config');
const mealPlanRoutes = require('./routes/mealPlan.routes');
const errorMiddleware = require('./middleware/error.middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8004;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Root route with API documentation
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Welcome to the Meal Planning API',
    version: '1.0.0',
    endpoints: {
      mealPlans: {
        create: 'POST /api/meal-plans',
        get: 'GET /api/meal-plans/:planId',
        addRecipe: 'POST /api/meal-plans/:planId/recipes',
        getShoppingList: 'GET /api/meal-plans/:planId/shopping-list',
        getNutrition: 'GET /api/meal-plans/:planId/nutrition'
      }
    },
    documentation: {
      authentication: 'Bearer token required in Authorization header',
      example: {
        headers: {
          'Authorization': 'Bearer your_jwt_token',
          'Content-Type': 'application/json'
        }
      }
    }
  });
});

// API Routes
app.use('/api/meal-plans', mealPlanRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Error handling
app.use(errorMiddleware);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource does not exist'
  });
});

app.listen(PORT, () => {
  console.log(`Meal Plan Service running on port ${PORT}`);

});
// Simple Express server for handling data and predictions

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = path.join(__dirname, 'uploads');
      
      // Create uploads directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      cb(null, `data-${Date.now()}${path.extname(file.originalname)}`);
    }
  }),
  fileFilter: function (req, file, cb) {
    // Only accept CSV files
    if (file.mimetype !== 'text/csv') {
      return cb(new Error('Only CSV files are allowed'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max file size
  }
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Routes

// Get available indicators
app.get('/api/indicators', (req, res) => {
  // This would normally fetch from a database
  // For now we'll return mock data
  const indicators = [
    { id: 'gdp', name: 'GDP Growth Rate', unit: '%', category: 'Economy' },
    { id: 'inflation', name: 'Inflation Rate', unit: '%', category: 'Economy' },
    { id: 'unemployment', name: 'Unemployment Rate', unit: '%', category: 'Labor' },
    // ... other indicators
  ];
  
  res.json({ indicators });
});

// Get time series data for indicators
app.get('/api/data', (req, res) => {
  // Parse query parameters
  const indicators = req.query.indicators ? req.query.indicators.split(',') : [];
  const timeRange = req.query.timeRange || 'all';
  
  // This would normally fetch from a database or process a CSV file
  // For now, return mock data
  const data = generateMockData(indicators, timeRange);
  
  res.json({ data });
});

// Upload CSV data
app.post('/api/upload', upload.single('csvFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // Process the uploaded CSV file
  // This would parse the CSV and store the data for use in the app
  
  res.json({
    message: 'File uploaded successfully',
    filename: req.file.filename
  });
});

// Generate predictions
app.post('/api/predict', (req, res) => {
  const { indicators, horizon, modelType } = req.body;
  
  if (!indicators || !indicators.length) {
    return res.status(400).json({ error: 'Indicators are required' });
  }
  
  if (!horizon || horizon < 1 || horizon > 24) {
    return res.status(400).json({ error: 'Horizon must be between 1 and 24 months' });
  }
  
  // This would normally call a Python script or ML model
  // For now, return mock prediction data
  const predictions = generateMockPredictions(indicators, horizon);
  
  res.json({ predictions });
});

// Function to generate mock time series data
function generateMockData(indicators, timeRange) {
  const data = {};
  const now = new Date();
  let startDate = new Date();
  
  // Set start date based on time range
  switch(timeRange) {
    case '1y':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    case '5y':
      startDate.setFullYear(now.getFullYear() - 5);
      break;
    case '10y':
      startDate.setFullYear(now.getFullYear() - 10);
      break;
    default:
      startDate.setFullYear(now.getFullYear() - 10);
  }
  
  // Generate data for each indicator
  indicators.forEach(indicator => {
    data[indicator] = [];
    
    // Base value for this indicator
    let value = getBaseValueForIndicator(indicator);
    
    // Generate monthly data points
    let currentDate = new Date(startDate);
    while (currentDate <= now) {
      // Add some random variation
      const randomFactor = (Math.random() - 0.5) * 0.2;
      value = value * (1 + randomFactor);
      
      data[indicator].push({
        date: currentDate.toISOString().substring(0, 10),
        value: parseFloat(value.toFixed(2))
      });
      
      // Move to next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  });
  
  return data;
}

// Function to generate mock prediction data
function generateMockPredictions(indicators, horizon) {
  const predictions = {};
  const now = new Date();
  
  indicators.forEach(indicator => {
    predictions[indicator] = {
      actual: [],
      predicted: [],
      upperBound: [],
      lowerBound: []
    };
    
    // Generate 12 months of historical data
    let value = getBaseValueForIndicator(indicator);
    let historicalDate = new Date();
    historicalDate.setFullYear(now.getFullYear() - 1);
    
    while (historicalDate <= now) {
      const randomFactor = (Math.random() - 0.5) * 0.1;
      value = value * (1 + randomFactor);
      
      predictions[indicator].actual.push({
        date: historicalDate.toISOString().substring(0, 10),
        value: parseFloat(value.toFixed(2))
      });
      
      historicalDate.setMonth(historicalDate.getMonth() + 1);
    }
    
    // Generate predictions for the specified horizon
    let predictionDate = new Date(now);
    let lastValue = value;
    
    for (let i = 1; i <= horizon; i++) {
      predictionDate.setMonth(predictionDate.getMonth() + 1);
      
      // Apply trend and random factor
      const trend = getTrendForIndicator(indicator);
      const randomFactor = (Math.random() - 0.5) * 0.15;
      lastValue = lastValue * (1 + trend + randomFactor);
      
      const date = predictionDate.toISOString().substring(0, 10);
      const predictedValue = parseFloat(lastValue.toFixed(2));
      
      // Add increasing uncertainty for further predictions
      const uncertainty = 0.05 + (i / horizon) * 0.15;
      
      predictions[indicator].predicted.push({
        date: date,
        value: predictedValue
      });
      
      predictions[indicator].upperBound.push({
        date: date,
        value: parseFloat((predictedValue * (1 + uncertainty)).toFixed(2))
      });
      
      predictions[indicator].lowerBound.push({
        date: date,
        value: parseFloat((predictedValue * (1 - uncertainty)).toFixed(2))
      });
    }
  });
  
  return predictions;
}

// Helper function to get base value for indicator
function getBaseValueForIndicator(indicator) {
  const baseValues = {
    gdp: 3.0,
    inflation: 1.5,
    unemployment: 10.0,
    trade_balance: -4.0,
    foreign_exchange: 25.0,
    fdi: 3.0,
    public_debt: 65.0,
    budget_deficit: -3.5,
    industrial_production: 2.5,
    consumer_confidence: 100.0,
    retail_sales: 3.5,
    tourism_revenue: 8.0
  };
  
  return baseValues[indicator] || Math.random() * 10;
}

// Helper function to get trend for indicator
function getTrendForIndicator(indicator) {
  const trends = {
    gdp: 0.005,
    inflation: 0.003,
    unemployment: -0.002,
    trade_balance: -0.003,
    foreign_exchange: 0.01,
    fdi: 0.004,
    public_debt: 0.002,
    budget_deficit: -0.001,
    industrial_production: 0.003,
    consumer_confidence: -0.001,
    retail_sales: 0.002,
    tourism_revenue: 0.005
  };
  
  return trends[indicator] || 0;
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
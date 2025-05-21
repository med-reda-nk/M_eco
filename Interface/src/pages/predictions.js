// Predictions Page
import { createPredictionChart } from '../components/charts/predictionChart.js';
import { getAvailableIndicators } from '../services/dataService.js';

/**
 * Initializes the predictions page
 */
export function initPredictions() {
  // Initialize prediction chart
  createPredictionChart();
  
  // Populate indicator checkboxes for prediction
  populatePredictionIndicators();
  
  // Handle prediction horizon slider
  const horizonSlider = document.querySelector('#predictionHorizon');
  const horizonValue = document.querySelector('#horizonValue');
  
  if (horizonSlider && horizonValue) {
    // Set initial value
    horizonValue.textContent = horizonSlider.value;
    
    // Update value on change
    horizonSlider.addEventListener('input', () => {
      horizonValue.textContent = horizonSlider.value;
    });
  }
  
  // Handle generate prediction button
  const generateBtn = document.querySelector('#generatePredictionBtn');
  if (generateBtn) {
    generateBtn.addEventListener('click', generatePrediction);
  }
  
  console.log('Predictions page initialized');
}

/**
 * Populates the prediction indicators selection
 */
function populatePredictionIndicators() {
  const container = document.querySelector('#predictionIndicators');
  if (!container) return;
  
  // Get available indicators
  const indicators = getAvailableIndicators();
  
  // Create checkbox for each indicator
  indicators.forEach(indicator => {
    const option = document.createElement('div');
    option.className = 'indicator-option';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `pred-${indicator.id}`;
    checkbox.value = indicator.id;
    
    if (indicator.id === 'gdp' || indicator.id === 'inflation') {
      checkbox.checked = true; // Pre-select important indicators
    }
    
    const label = document.createElement('label');
    label.htmlFor = `pred-${indicator.id}`;
    label.textContent = indicator.name;
    
    option.appendChild(checkbox);
    option.appendChild(label);
    container.appendChild(option);
  });
}

/**
 * Generates predictions based on selected indicators and horizon
 */
function generatePrediction() {
  // Get selected indicators
  const selectedIndicators = Array.from(
    document.querySelectorAll('#predictionIndicators input:checked')
  ).map(checkbox => checkbox.value);
  
  // Get prediction horizon
  const horizon = parseInt(document.querySelector('#predictionHorizon').value);
  
  // Validate selections
  if (selectedIndicators.length === 0) {
    alert('Please select at least one indicator for prediction.');
    return;
  }
  
  console.log(`Generating prediction for indicators: ${selectedIndicators.join(', ')} with horizon: ${horizon} months`);
  
  // Show loader
  const loader = document.querySelector('.prediction-loader');
  if (loader) {
    loader.classList.remove('hidden');
  }
  
  // Simulate prediction generation (would be an API call to the backend)
  setTimeout(() => {
    // Update prediction chart with new data
    updatePredictionChart(selectedIndicators, horizon);
    
    // Update metrics
    updatePredictionMetrics();
    
    // Hide loader
    if (loader) {
      loader.classList.add('hidden');
    }
  }, 2000);
}

/**
 * Updates the prediction chart with new data
 * @param {Array<string>} indicators - Selected indicator IDs
 * @param {number} horizon - Prediction horizon in months
 */
function updatePredictionChart(indicators, horizon) {
  console.log('Updating prediction chart with new data');
  
  // This would normally update the chart with new prediction data
  // For now, we'll just pretend it happened
}

/**
 * Updates the prediction metrics display
 */
function updatePredictionMetrics() {
  // In a real implementation, these would be returned from the model
  const metrics = {
    mae: (Math.random() * 0.4 + 0.1).toFixed(2),
    mse: (Math.random() * 0.3 + 0.05).toFixed(2),
    r2: (Math.random() * 0.2 + 0.8).toFixed(2),
    confidence: Math.floor(Math.random() * 6 + 90) + '%'
  };
  
  // Update metric values in the UI
  const metricElements = document.querySelectorAll('.metric-value');
  if (metricElements.length >= 4) {
    metricElements[0].textContent = metrics.mae;
    metricElements[1].textContent = metrics.mse;
    metricElements[2].textContent = metrics.r2;
    metricElements[3].textContent = metrics.confidence;
  }
}
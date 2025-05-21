// Dashboard Page
import { createMainChart } from '../components/charts/mainChart.js';
import { populateIndicatorOptions } from '../components/indicators.js';

/**
 * Initializes the dashboard page
 */
export function initDashboard() {
  // Initialize main chart
  createMainChart();
  
  // Populate indicator options
  populateIndicatorOptions();
  
  // Handle time range selection
  const timeRangeSelect = document.querySelector('#timeRange');
  if (timeRangeSelect) {
    timeRangeSelect.addEventListener('change', () => {
      updateDashboardData(timeRangeSelect.value);
    });
  }
  
  // Handle view type toggle
  const viewButtons = document.querySelectorAll('.btn-group .btn');
  if (viewButtons.length) {
    viewButtons.forEach(button => {
      button.addEventListener('click', () => {
        viewButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const viewType = button.getAttribute('data-view');
        updateChartType(viewType);
      });
    });
  }
  
  // Handle custom select dropdown for indicators
  const selectedDiv = document.querySelector('.select-selected');
  const selectItemsDiv = document.querySelector('.select-items');
  
  if (selectedDiv && selectItemsDiv) {
    selectedDiv.addEventListener('click', function(e) {
      e.stopPropagation();
      selectItemsDiv.classList.toggle('select-hide');
      selectedDiv.classList.toggle('active');
    });
    
    // Close the select box when clicking elsewhere
    document.addEventListener('click', function() {
      selectItemsDiv.classList.add('select-hide');
      selectedDiv.classList.remove('active');
    });
  }
  
  console.log('Dashboard initialized');
}

/**
 * Updates dashboard data based on the selected time range
 * @param {string} timeRange - The selected time range (e.g., '1y', '5y')
 */
function updateDashboardData(timeRange) {
  console.log(`Updating dashboard data for time range: ${timeRange}`);
  
  // Show loader while data is being fetched
  const chartLoader = document.querySelector('.chart-loader');
  if (chartLoader) {
    chartLoader.classList.remove('hidden');
  }
  
  // Simulate API call delay
  setTimeout(() => {
    // Update charts with new data
    // This would normally make an API call to get data for the selected time range
    
    // Hide loader when data is ready
    if (chartLoader) {
      chartLoader.classList.add('hidden');
    }
  }, 800);
}

/**
 * Updates the chart type based on user selection
 * @param {string} type - The chart type ('line', 'bar', 'area')
 */
function updateChartType(type) {
  console.log(`Changing chart type to: ${type}`);
  
  // Show loader while chart is updating
  const chartLoader = document.querySelector('.chart-loader');
  if (chartLoader) {
    chartLoader.classList.remove('hidden');
  }
  
  // Simulate chart update delay
  setTimeout(() => {
    // Update chart type
    // In a real implementation, we would call Chart.js update method
    
    // Hide loader when chart is ready
    if (chartLoader) {
      chartLoader.classList.add('hidden');
    }
  }, 500);
}
// Indicators Component
import { getAvailableIndicators } from '../services/dataService.js';

/**
 * Populates the indicator selection dropdown with available indicators
 */
export function populateIndicatorOptions() {
  const container = document.querySelector('#indicatorOptions');
  if (!container) return;
  
  // Get available indicators
  const indicators = getAvailableIndicators();
  
  // Create option for each indicator
  indicators.forEach(indicator => {
    const option = document.createElement('div');
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `ind-${indicator.id}`;
    checkbox.value = indicator.id;
    
    if (indicator.id === 'gdp' || indicator.id === 'inflation' || indicator.id === 'unemployment') {
      checkbox.checked = true; // Pre-select important indicators
    }
    
    const label = document.createElement('label');
    label.htmlFor = `ind-${indicator.id}`;
    label.textContent = indicator.name;
    
    option.appendChild(checkbox);
    option.appendChild(label);
    container.appendChild(option);
    
    // Handle checkbox changes
    checkbox.addEventListener('change', updateSelectedIndicators);
  });
  
  // Initial update of selected text
  updateSelectedIndicators();
}

/**
 * Updates the selected indicators text in the dropdown
 */
function updateSelectedIndicators() {
  const selectedSpan = document.querySelector('.select-selected span');
  if (!selectedSpan) return;
  
  const checkedBoxes = document.querySelectorAll('#indicatorOptions input:checked');
  
  if (checkedBoxes.length === 0) {
    selectedSpan.textContent = 'Select indicators...';
  } else if (checkedBoxes.length <= 2) {
    const names = Array.from(checkedBoxes).map(checkbox => {
      return checkbox.nextElementSibling.textContent;
    });
    selectedSpan.textContent = names.join(', ');
  } else {
    selectedSpan.textContent = `${checkedBoxes.length} indicators selected`;
  }
  
  // Here we would normally update the chart based on selected indicators
  // This would make an API call to get data for selected indicators
  updateChartsForSelectedIndicators();
}

/**
 * Updates charts based on selected indicators
 */
function updateChartsForSelectedIndicators() {
  const checkedBoxes = document.querySelectorAll('#indicatorOptions input:checked');
  const selectedIndicators = Array.from(checkedBoxes).map(checkbox => checkbox.value);
  
  console.log(`Updating charts for indicators: ${selectedIndicators.join(', ')}`);
  
  // Show loader while chart is updating
  const chartLoader = document.querySelector('.chart-loader');
  if (chartLoader) {
    chartLoader.classList.remove('hidden');
  }
  
  // Simulate update delay
  setTimeout(() => {
    // In a real implementation, we would update chart data here
    
    // Hide loader when chart is ready
    if (chartLoader) {
      chartLoader.classList.add('hidden');
    }
  }, 800);
}
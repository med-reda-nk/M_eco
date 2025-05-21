// Global Event Handlers

/**
 * Sets up global event listeners for the application
 */
export function setupEventListeners() {
  // Handle download chart button
  const downloadChartBtn = document.querySelector('#downloadChartBtn');
  if (downloadChartBtn) {
    downloadChartBtn.addEventListener('click', () => {
      const canvas = document.querySelector('#mainChart');
      if (canvas) {
        // Convert chart to image and download
        const image = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.download = 'morocco-economic-indicators.png';
        link.href = image;
        link.click();
      }
    });
  }
  
  // Handle expand chart button
  const expandChartBtn = document.querySelector('#expandChartBtn');
  if (expandChartBtn) {
    expandChartBtn.addEventListener('click', () => {
      // This would normally create a fullscreen view of the chart
      alert('Fullscreen chart view would appear here');
    });
  }
  
  // Handle prediction horizon slider
  const predictionHorizon = document.querySelector('#predictionHorizon');
  const horizonValue = document.querySelector('#horizonValue');
  if (predictionHorizon && horizonValue) {
    predictionHorizon.addEventListener('input', () => {
      horizonValue.textContent = predictionHorizon.value;
    });
  }
  
  // Handle generate prediction button
  const generatePredictionBtn = document.querySelector('#generatePredictionBtn');
  if (generatePredictionBtn) {
    generatePredictionBtn.addEventListener('click', () => {
      const predictionLoader = document.querySelector('.prediction-loader');
      if (predictionLoader) {
        predictionLoader.classList.remove('hidden');
        
        // Simulate prediction generation
        setTimeout(() => {
          predictionLoader.classList.add('hidden');
          // Here we would normally update the prediction chart with new data
          alert('Prediction generated successfully!');
        }, 2000);
      }
    });
  }
  
  // Handle settings form submission
  const saveSettingsBtn = document.querySelector('#saveSettingsBtn');
  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', () => {
      // Here we would normally save the settings to localStorage or send to server
      alert('Settings saved successfully!');
    });
  }
  
  // Handle reset settings button
  const resetSettingsBtn = document.querySelector('#resetSettingsBtn');
  if (resetSettingsBtn) {
    resetSettingsBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all settings to default?')) {
        // Reset form inputs to default values
        document.querySelectorAll('#settings select').forEach(select => {
          select.selectedIndex = Array.from(select.options)
            .findIndex(option => option.hasAttribute('selected'));
        });
        
        document.querySelectorAll('#settings input[type="checkbox"]').forEach(checkbox => {
          checkbox.checked = checkbox.hasAttribute('checked');
        });
        
        alert('Settings reset to default values.');
      }
    });
  }
  
  // Handle refresh data button
  const refreshDataBtn = document.querySelector('#refreshDataBtn');
  if (refreshDataBtn) {
    refreshDataBtn.addEventListener('click', () => {
      const tableLoader = document.querySelector('.table-loader');
      if (tableLoader) {
        tableLoader.classList.remove('hidden');
        
        // Simulate data refresh
        setTimeout(() => {
          tableLoader.classList.add('hidden');
          alert('Data refreshed successfully!');
        }, 1500);
      }
    });
  }
  
  // Handle pagination
  const prevPageBtn = document.querySelector('#prevPage');
  const nextPageBtn = document.querySelector('#nextPage');
  const currentPageEl = document.querySelector('#currentPage');
  
  if (prevPageBtn && nextPageBtn && currentPageEl) {
    let currentPage = 1;
    
    prevPageBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        currentPageEl.textContent = currentPage;
        updatePaginationState();
      }
    });
    
    nextPageBtn.addEventListener('click', () => {
      const totalPages = parseInt(document.querySelector('#totalPages').textContent);
      if (currentPage < totalPages) {
        currentPage++;
        currentPageEl.textContent = currentPage;
        updatePaginationState();
      }
    });
    
    function updatePaginationState() {
      const totalPages = parseInt(document.querySelector('#totalPages').textContent);
      prevPageBtn.disabled = currentPage === 1;
      nextPageBtn.disabled = currentPage === totalPages;
      
      // Here we would normally fetch the data for the current page
      const tableLoader = document.querySelector('.table-loader');
      if (tableLoader) {
        tableLoader.classList.remove('hidden');
        
        // Simulate data loading
        setTimeout(() => {
          tableLoader.classList.add('hidden');
        }, 500);
      }
    }
    
    // Set initial state
    updatePaginationState();
  }
  
  console.log('Global event handlers initialized');
}
// Settings Page

/**
 * Initializes the settings page functionality
 */
export function initSettings() {
  // Load saved settings
  loadSavedSettings();
  
  // Set up save settings handler
  const saveBtn = document.querySelector('#saveSettingsBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', saveSettings);
  }
  
  // Set up reset settings handler
  const resetBtn = document.querySelector('#resetSettingsBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetSettings);
  }
  
  console.log('Settings initialized');
}

/**
 * Loads previously saved settings from localStorage
 */
function loadSavedSettings() {
  // Try to get saved settings
  const savedSettings = localStorage.getItem('dashboardSettings');
  
  if (savedSettings) {
    const settings = JSON.parse(savedSettings);
    
    // Apply settings to form controls
    for (const [key, value] of Object.entries(settings)) {
      const element = document.getElementById(key);
      
      if (element) {
        if (element.type === 'checkbox') {
          element.checked = value;
        } else {
          element.value = value;
        }
      }
    }
    
    console.log('Loaded saved settings');
  } else {
    console.log('No saved settings found, using defaults');
  }
}

/**
 * Saves current settings to localStorage
 */
function saveSettings() {
  const settings = {};
  
  // Get all form controls in the settings page
  const controls = document.querySelectorAll('#settings input, #settings select');
  
  controls.forEach(control => {
    if (control.id) {
      settings[control.id] = control.type === 'checkbox' ? control.checked : control.value;
    }
  });
  
  // Save to localStorage
  localStorage.setItem('dashboardSettings', JSON.stringify(settings));
  
  console.log('Settings saved successfully');
  
  // Show success message
  alert('Settings saved successfully!');
}

/**
 * Resets settings to default values
 */
function resetSettings() {
  if (confirm('Are you sure you want to reset all settings to default?')) {
    // Reset checkboxes based on their default checked attribute
    document.querySelectorAll('#settings input[type="checkbox"]').forEach(checkbox => {
      // Default for chart animations is checked
      if (checkbox.id === 'chartAnimations') {
        checkbox.checked = true;
      }
      // Default for dark mode comes from system preference
      else if (checkbox.id === 'darkMode') {
        checkbox.checked = document.body.classList.contains('dark-mode');
      }
      // Default for data cache is checked
      else if (checkbox.id === 'dataCache') {
        checkbox.checked = true;
      }
      // For any other checkboxes
      else {
        checkbox.checked = false;
      }
    });
    
    // Reset selects to their default selected option
    document.querySelectorAll('#settings select').forEach(select => {
      // Find the option with the selected attribute and select it
      const defaultOption = Array.from(select.options).find(option => 
        option.hasAttribute('selected')
      );
      
      if (defaultOption) {
        select.value = defaultOption.value;
      } else {
        // If no default is specified, select the first option
        select.selectedIndex = 0;
      }
    });
    
    // Clear saved settings
    localStorage.removeItem('dashboardSettings');
    
    console.log('Settings reset to defaults');
    
    // Show success message
    alert('Settings reset to default values.');
  }
}
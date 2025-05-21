import { initNavigation } from './components/navigation.js';
import { initThemeToggle } from './components/theme.js';
import { initDashboard } from './pages/dashboard.js';
import { initPredictions } from './pages/predictions.js';
import { initDataManagement } from './pages/dataManagement.js';
import { initSettings } from './pages/settings.js';
import { initModals } from './components/modals.js';
import { loadMockData } from './services/dataService.js';
import { setupEventListeners } from './utils/eventHandlers.js';

// Initialize application
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Initializing Morocco Economic Dashboard...');
  
  // Load initial data (mock data until CSV is provided)
  await loadMockData();
  
  // Initialize components
  initNavigation();
  initThemeToggle();
  initModals();
  
  // Initialize pages
  initDashboard();
  initPredictions();
  initDataManagement();
  initSettings();
  
  // Setup global event listeners
  setupEventListeners();
  
  // Hide all loaders once app is ready
  document.querySelectorAll('.chart-loader, .table-loader, .prediction-loader').forEach(loader => {
    loader.classList.add('hidden');
  });
  
  console.log('Application initialized successfully');
});
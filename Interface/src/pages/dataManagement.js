// Data Management Page
import { getSampleTableData } from '../services/dataService.js';

/**
 * Initializes the data management page
 */
export function initDataManagement() {
  // Initial data load
  loadTableData(1);
  
  // Set up pagination handlers
  const prevPageBtn = document.querySelector('#prevPage');
  const nextPageBtn = document.querySelector('#nextPage');
  
  if (prevPageBtn && nextPageBtn) {
    prevPageBtn.addEventListener('click', () => {
      const currentPage = parseInt(document.querySelector('#currentPage').textContent);
      if (currentPage > 1) {
        loadTableData(currentPage - 1);
      }
    });
    
    nextPageBtn.addEventListener('click', () => {
      const currentPage = parseInt(document.querySelector('#currentPage').textContent);
      const totalPages = parseInt(document.querySelector('#totalPages').textContent);
      if (currentPage < totalPages) {
        loadTableData(currentPage + 1);
      }
    });
  }
  
  // Set up refresh data handler
  const refreshBtn = document.querySelector('#refreshDataBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      const currentPage = parseInt(document.querySelector('#currentPage').textContent);
      loadTableData(currentPage, true);
    });
  }
  
  console.log('Data management initialized');
}

/**
 * Loads data into the table for a specific page
 * @param {number} page - The page number to load
 * @param {boolean} [isRefresh=false] - Whether this is a refresh operation
 */
function loadTableData(page, isRefresh = false) {
  // Show loader
  const loader = document.querySelector('.table-loader');
  if (loader) {
    loader.classList.remove('hidden');
  }
  
  // Update current page display
  const currentPageEl = document.querySelector('#currentPage');
  if (currentPageEl) {
    currentPageEl.textContent = page;
  }
  
  // Disable/enable pagination buttons
  const prevPageBtn = document.querySelector('#prevPage');
  const nextPageBtn = document.querySelector('#nextPage');
  const totalPages = parseInt(document.querySelector('#totalPages').textContent);
  
  if (prevPageBtn) {
    prevPageBtn.disabled = page === 1;
  }
  
  if (nextPageBtn) {
    nextPageBtn.disabled = page === totalPages;
  }
  
  // Simulate loading delay
  setTimeout(() => {
    // Get sample data
    const data = getSampleTableData(page, 10);
    
    // Populate table
    populateTable(data);
    
    // Hide loader
    if (loader) {
      loader.classList.add('hidden');
    }
    
    if (isRefresh) {
      console.log('Data refreshed');
    } else {
      console.log(`Loaded data for page ${page}`);
    }
  }, isRefresh ? 1000 : 500);
}

/**
 * Populates the data table with provided data
 * @param {Array<Object>} data - The data to display in the table
 */
function populateTable(data) {
  const tableBody = document.querySelector('#dataTable tbody');
  if (!tableBody) return;
  
  // Clear existing rows
  tableBody.innerHTML = '';
  
  // Add new rows
  data.forEach(item => {
    const row = document.createElement('tr');
    
    // Format date
    const date = new Date(item.date);
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    
    // Create cells
    const dateCell = document.createElement('td');
    dateCell.textContent = formattedDate;
    
    const indicatorCell = document.createElement('td');
    indicatorCell.textContent = item.indicator;
    
    const valueCell = document.createElement('td');
    valueCell.textContent = item.value.toFixed(2);
    
    const yoyCell = document.createElement('td');
    yoyCell.textContent = (item.yoy > 0 ? '+' : '') + item.yoy.toFixed(2) + '%';
    yoyCell.className = item.yoy >= 0 ? 'positive' : 'negative';
    
    const sourceCell = document.createElement('td');
    sourceCell.textContent = item.source;
    
    // Add cells to row
    row.appendChild(dateCell);
    row.appendChild(indicatorCell);
    row.appendChild(valueCell);
    row.appendChild(yoyCell);
    row.appendChild(sourceCell);
    
    // Add row to table
    tableBody.appendChild(row);
  });
}
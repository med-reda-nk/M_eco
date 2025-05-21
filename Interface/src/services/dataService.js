// Data Service
// Handles data operations and API calls

/**
 * Loads mock data for initial display
 * @returns {Promise<Object>} Mock data object
 */
export async function loadMockData() {
  console.log('Loading mock data for visualization');
  
  // Simulate API delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        indicators: getAvailableIndicators(),
        timeSeries: getMockTimeSeriesData()
      });
    }, 800);
  });
}

/**
 * Returns list of available economic indicators
 * @returns {Array<Object>} List of indicator objects
 */
export function getAvailableIndicators() {
  return [
    { id: 'gdp', name: 'GDP Growth Rate', unit: '%', category: 'Economy' },
    { id: 'inflation', name: 'Inflation Rate', unit: '%', category: 'Economy' },
    { id: 'unemployment', name: 'Unemployment Rate', unit: '%', category: 'Labor' },
    { id: 'trade_balance', name: 'Trade Balance', unit: 'B MAD', category: 'Trade' },
    { id: 'foreign_exchange', name: 'Foreign Exchange Reserves', unit: 'B USD', category: 'Finance' },
    { id: 'fdi', name: 'Foreign Direct Investment', unit: 'B MAD', category: 'Finance' },
    { id: 'public_debt', name: 'Public Debt to GDP', unit: '%', category: 'Finance' },
    { id: 'budget_deficit', name: 'Budget Deficit to GDP', unit: '%', category: 'Finance' },
    { id: 'industrial_production', name: 'Industrial Production', unit: '%', category: 'Industry' },
    { id: 'consumer_confidence', name: 'Consumer Confidence Index', unit: 'Index', category: 'Economy' },
    { id: 'retail_sales', name: 'Retail Sales Growth', unit: '%', category: 'Economy' },
    { id: 'tourism_revenue', name: 'Tourism Revenue', unit: 'B MAD', category: 'Tourism' }
  ];
}

/**
 * Generates mock time series data for visualization
 * @returns {Object} Mock time series data
 */
function getMockTimeSeriesData() {
  // Generate quarterly data for the last 5 years
  const quarters = 20;
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 5);
  
  const data = {};
  const indicators = getAvailableIndicators();
  
  indicators.forEach(indicator => {
    data[indicator.id] = [];
    
    // Base value for this indicator
    let baseValue = getBaseValueForIndicator(indicator.id);
    
    for (let i = 0; i < quarters; i++) {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + (i * 3));
      
      // Add some random variation
      const variance = (Math.random() - 0.5) * getVarianceForIndicator(indicator.id);
      const value = baseValue + variance;
      
      // Trend over time
      baseValue += getTrendForIndicator(indicator.id);
      
      data[indicator.id].push({
        date: date.toISOString(),
        value: value
      });
    }
  });
  
  return data;
}

/**
 * Gets base value for a specific indicator
 * @param {string} indicatorId - ID of the indicator
 * @returns {number} Base value
 */
function getBaseValueForIndicator(indicatorId) {
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
  
  return baseValues[indicatorId] || 0;
}

/**
 * Gets variance amount for a specific indicator
 * @param {string} indicatorId - ID of the indicator
 * @returns {number} Variance amount
 */
function getVarianceForIndicator(indicatorId) {
  const variances = {
    gdp: 1.0,
    inflation: 0.5,
    unemployment: 1.0,
    trade_balance: 0.8,
    foreign_exchange: 2.0,
    fdi: 0.5,
    public_debt: 2.0,
    budget_deficit: 0.5,
    industrial_production: 1.5,
    consumer_confidence: 5.0,
    retail_sales: 1.0,
    tourism_revenue: 0.8
  };
  
  return variances[indicatorId] || 0.5;
}

/**
 * Gets trend direction for a specific indicator
 * @param {string} indicatorId - ID of the indicator
 * @returns {number} Trend value
 */
function getTrendForIndicator(indicatorId) {
  const trends = {
    gdp: 0.05,
    inflation: 0.03,
    unemployment: -0.02,
    trade_balance: -0.03,
    foreign_exchange: 0.1,
    fdi: 0.04,
    public_debt: 0.2,
    budget_deficit: -0.01,
    industrial_production: 0.03,
    consumer_confidence: -0.1,
    retail_sales: 0.02,
    tourism_revenue: 0.05
  };
  
  return trends[indicatorId] || 0;
}

/**
 * Gets sample data for the data table
 * @param {number} page - Page number
 * @param {number} pageSize - Number of records per page
 * @returns {Array<Object>} Table data for the requested page
 */
export function getSampleTableData(page, pageSize) {
  // Generate sample data for the table
  const data = [];
  const indicators = getAvailableIndicators();
  const startIndex = (page - 1) * pageSize;
  
  for (let i = 0; i < pageSize; i++) {
    const indicator = indicators[Math.floor(Math.random() * indicators.length)];
    const baseValue = getBaseValueForIndicator(indicator.id);
    
    // Generate a date within the last 3 months
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 90));
    
    // Generate a random value based on the indicator
    const value = baseValue + (Math.random() - 0.5) * getVarianceForIndicator(indicator.id);
    
    // Generate YoY change
    const yoy = (Math.random() - 0.3) * 5; // Skewed slightly negative
    
    // Random source
    const sources = [
      'Haut-Commissariat au Plan',
      'Bank Al-Maghrib',
      'Ministry of Finance',
      'Ministry of Economy',
      'Office des Changes'
    ];
    const source = sources[Math.floor(Math.random() * sources.length)];
    
    data.push({
      id: startIndex + i + 1,
      date: date.toISOString(),
      indicator: indicator.name,
      value: value,
      yoy: yoy,
      source: source
    });
  }
  
  return data;
}

/**
 * Simulates loading data from a CSV file
 * @param {File} file - The CSV file to read
 * @returns {Promise<Object>} Parsed data from the CSV
 */
export function loadCSVData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const csvData = event.target.result;
        const parsedData = parseCSV(csvData);
        resolve(parsedData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsText(file);
  });
}

/**
 * Parses CSV data into structured format
 * @param {string} csvText - Raw CSV text
 * @returns {Object} Structured data object
 */
function parseCSV(csvText) {
  // Simple CSV parser - in a real app would use a library
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  
  const data = {};
  
  // Initialize data structure
  headers.forEach(header => {
    if (header !== 'date') {
      data[header] = [];
    }
  });
  
  // Parse each line
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = lines[i].split(',').map(value => value.trim());
    const date = values[0]; // Assuming first column is date
    
    for (let j = 1; j < headers.length; j++) {
      const header = headers[j];
      const value = parseFloat(values[j]);
      
      if (!isNaN(value)) {
        data[header].push({
          date: date,
          value: value
        });
      }
    }
  }
  
  return data;
}
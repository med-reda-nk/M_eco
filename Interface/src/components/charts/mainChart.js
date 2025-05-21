// Main Chart Component

/**
 * Creates and initializes the main chart on the dashboard
 */
export function createMainChart() {
  // Check if Chart.js is loaded
  if (typeof Chart === 'undefined') {
    // Load Chart.js dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
    script.onload = initializeChart;
    document.head.appendChild(script);
  } else {
    initializeChart();
  }
}

/**
 * Initializes the main chart with sample data
 */
function initializeChart() {
  const ctx = document.getElementById('mainChart').getContext('2d');
  
  // Sample data for the chart
  const labels = ['Q1 2020', 'Q2 2020', 'Q3 2020', 'Q4 2020', 
                  'Q1 2021', 'Q2 2021', 'Q3 2021', 'Q4 2021',
                  'Q1 2022', 'Q2 2022', 'Q3 2022', 'Q4 2022',
                  'Q1 2023', 'Q2 2023'];
  
  const gdpData = [2.5, -14.2, -6.3, -5.1, 1.0, 15.2, 7.8, 6.6, 1.3, 2.0, 3.3, 3.5, 3.2, 3.5];
  const inflationData = [1.4, 0.5, 0.7, 0.9, 0.8, 1.7, 1.6, 2.5, 3.6, 7.2, 8.3, 8.0, 7.1, 6.3];
  const unemploymentData = [8.1, 12.3, 12.7, 11.9, 12.5, 12.8, 11.8, 11.4, 12.1, 11.2, 11.8, 11.5, 12.0, 11.8];
  
  // Create chart
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'GDP Growth Rate',
          data: gdpData,
          borderColor: '#C11E38',
          backgroundColor: 'rgba(193, 30, 56, 0.1)',
          tension: 0.4,
          fill: false,
          borderWidth: 2,
          pointRadius: 3
        },
        {
          label: 'Inflation Rate',
          data: inflationData,
          borderColor: '#006233',
          backgroundColor: 'rgba(0, 98, 51, 0.1)',
          tension: 0.4,
          fill: false,
          borderWidth: 2,
          pointRadius: 3
        },
        {
          label: 'Unemployment Rate',
          data: unemploymentData,
          borderColor: '#F3B229',
          backgroundColor: 'rgba(243, 178, 41, 0.1)',
          tension: 0.4,
          fill: false,
          borderWidth: 2,
          pointRadius: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            font: {
              family: "'Poppins', sans-serif",
              size: 12
            }
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(31, 41, 55, 0.9)',
          titleFont: {
            family: "'Poppins', sans-serif",
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            family: "'Poppins', sans-serif",
            size: 12
          },
          padding: 12,
          cornerRadius: 8
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              family: "'Poppins', sans-serif",
              size: 11
            }
          }
        },
        y: {
          grid: {
            borderDash: [4, 4]
          },
          ticks: {
            font: {
              family: "'Poppins', sans-serif",
              size: 11
            },
            callback: function(value) {
              return value + '%';
            }
          }
        }
      },
      interaction: {
        mode: 'nearest',
        intersect: false,
        axis: 'x'
      },
      animations: {
        tension: {
          duration: 1000,
          easing: 'linear'
        }
      }
    }
  });
  
  // Create smaller charts for the grid
  createSecondaryCharts();
  
  console.log('Main chart initialized');
  return chart;
}

/**
 * Creates secondary charts for the dashboard
 */
function createSecondaryCharts() {
  // Define charts to create
  const secondaryCharts = [
    {
      title: 'Foreign Direct Investment',
      data: [2.1, 1.8, 2.5, 3.2, 2.8, 3.5, 3.8, 4.2],
      color: '#4F46E5'
    },
    {
      title: 'Trade Balance',
      data: [-3.2, -3.8, -4.1, -3.7, -4.2, -4.5, -3.9, -4.2],
      color: '#EC4899'
    }
  ];
  
  // Create container for charts if not already in the HTML
  const chartsGrid = document.querySelector('.charts-grid');
  if (!chartsGrid) return;
  
  // Clear existing charts
  chartsGrid.innerHTML = '';
  
  // Create each chart
  secondaryCharts.forEach((chartData, index) => {
    // Create chart wrapper
    const chartWrapper = document.createElement('div');
    chartWrapper.className = 'chart-wrapper';
    
    // Create chart header
    const chartHeader = document.createElement('div');
    chartHeader.className = 'chart-header';
    
    const chartTitle = document.createElement('h3');
    chartTitle.className = 'chart-title';
    chartTitle.textContent = chartData.title;
    
    const chartActions = document.createElement('div');
    chartActions.className = 'chart-actions';
    
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'btn btn-icon';
    downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
    
    const expandBtn = document.createElement('button');
    expandBtn.className = 'btn btn-icon';
    expandBtn.innerHTML = '<i class="fas fa-expand"></i>';
    
    chartActions.appendChild(downloadBtn);
    chartActions.appendChild(expandBtn);
    
    chartHeader.appendChild(chartTitle);
    chartHeader.appendChild(chartActions);
    
    // Create chart container
    const chartContainer = document.createElement('div');
    chartContainer.className = 'chart-container';
    
    const canvas = document.createElement('canvas');
    canvas.id = `chart-${index + 1}`;
    
    chartContainer.appendChild(canvas);
    
    // Assemble chart wrapper
    chartWrapper.appendChild(chartHeader);
    chartWrapper.appendChild(chartContainer);
    
    // Add to grid
    chartsGrid.appendChild(chartWrapper);
    
    // Initialize chart
    initializeSecondaryChart(canvas.id, chartData);
  });
}

/**
 * Initializes a secondary chart with the provided data
 * @param {string} chartId - The ID of the canvas element
 * @param {Object} chartData - The data for the chart
 */
function initializeSecondaryChart(chartId, chartData) {
  const ctx = document.getElementById(chartId).getContext('2d');
  
  // Sample data
  const labels = ['Q1 2022', 'Q2 2022', 'Q3 2022', 'Q4 2022', 
                 'Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023'];
  
  // Create gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 200);
  gradient.addColorStop(0, `${chartData.color}33`); // 20% opacity
  gradient.addColorStop(1, `${chartData.color}00`); // 0% opacity
  
  // Create chart
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: chartData.title,
          data: chartData.data,
          borderColor: chartData.color,
          backgroundColor: gradient,
          tension: 0.4,
          fill: true,
          borderWidth: 2,
          pointRadius: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(31, 41, 55, 0.9)',
          titleFont: {
            family: "'Poppins', sans-serif",
            size: 12,
            weight: 'bold'
          },
          bodyFont: {
            family: "'Poppins', sans-serif",
            size: 11
          },
          padding: 10,
          cornerRadius: 8
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              family: "'Poppins', sans-serif",
              size: 10
            }
          }
        },
        y: {
          grid: {
            borderDash: [4, 4]
          },
          ticks: {
            font: {
              family: "'Poppins', sans-serif",
              size: 10
            }
          }
        }
      },
      elements: {
        point: {
          hoverRadius: 6,
          hoverBorderWidth: 2
        }
      }
    }
  });
  
  return chart;
}
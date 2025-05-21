// Prediction Chart Component

/**
 * Creates and initializes the prediction chart
 */
export function createPredictionChart() {
  // Check if Chart.js is loaded
  if (typeof Chart === 'undefined') {
    // Load Chart.js dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
    script.onload = initializePredictionChart;
    document.head.appendChild(script);
  } else {
    initializePredictionChart();
  }
}

/**
 * Initializes the prediction chart with sample data
 */
function initializePredictionChart() {
  const ctx = document.getElementById('predictionChart').getContext('2d');
  
  // Sample data for prediction chart
  const labels = [
    'Jan 2022', 'Feb 2022', 'Mar 2022', 'Apr 2022', 'May 2022', 'Jun 2022',
    'Jul 2022', 'Aug 2022', 'Sep 2022', 'Oct 2022', 'Nov 2022', 'Dec 2022',
    'Jan 2023', 'Feb 2023', 'Mar 2023', 'Apr 2023', 'May 2023', 'Jun 2023',
    'Jul 2023', 'Aug 2023', 'Sep 2023', 'Oct 2023', 'Nov 2023', 'Dec 2023',
    'Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024',
  ];
  
  // Historical data ends at index 17 (Jun 2023), then we have predictions
  const historicalEndIndex = 17;
  
  // Actual GDP data
  const gdpActual = [
    3.1, 3.2, 3.0, 3.3, 3.5, 3.4, 3.6, 3.8, 3.7, 3.5, 3.4, 3.3,
    3.2, 3.0, 2.9, 3.1, 3.3, 3.5
  ];
  
  // Predicted GDP data (includes confidence intervals)
  const gdpPredicted = [
    null, null, null, null, null, null, null, null, null, null, null, null,
    null, null, null, null, null, null,
    3.6, 3.7, 3.8, 3.9, 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7
  ];
  
  // Upper confidence interval
  const gdpUpper = [
    null, null, null, null, null, null, null, null, null, null, null, null,
    null, null, null, null, null, null,
    3.9, 4.1, 4.2, 4.4, 4.5, 4.7, 4.8, 5.0, 5.1, 5.3, 5.4, 5.6
  ];
  
  // Lower confidence interval
  const gdpLower = [
    null, null, null, null, null, null, null, null, null, null, null, null,
    null, null, null, null, null, null,
    3.3, 3.3, 3.4, 3.4, 3.5, 3.5, 3.6, 3.6, 3.7, 3.7, 3.8, 3.8
  ];
  
  // Create chart
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'GDP Growth (Actual)',
          data: gdpActual,
          borderColor: '#006233',
          backgroundColor: 'rgba(0, 98, 51, 0.1)',
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 3,
          fill: false
        },
        {
          label: 'GDP Growth (Predicted)',
          data: gdpPredicted,
          borderColor: '#C11E38',
          backgroundColor: 'rgba(193, 30, 56, 0.1)',
          tension: 0.4,
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 3,
          fill: false
        },
        {
          label: 'Upper Confidence Bound',
          data: gdpUpper,
          borderColor: 'rgba(193, 30, 56, 0.3)',
          backgroundColor: 'rgba(193, 30, 56, 0.05)',
          tension: 0.4,
          borderWidth: 1,
          pointRadius: 0,
          fill: false
        },
        {
          label: 'Lower Confidence Bound',
          data: gdpLower,
          borderColor: 'rgba(193, 30, 56, 0.3)',
          backgroundColor: 'rgba(193, 30, 56, 0.05)',
          tension: 0.4,
          borderWidth: 1,
          pointRadius: 0,
          fill: 2 // Fill between this dataset and the dataset at index 2
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
            filter: function(legendItem, chartData) {
              // Hide upper and lower bounds from legend
              return !legendItem.text.includes('Confidence');
            },
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
          cornerRadius: 8,
          callbacks: {
            title: function(context) {
              return context[0].label;
            },
            label: function(context) {
              const datasetLabel = context.dataset.label || '';
              const value = context.parsed.y || 0;
              
              // Only show actual and predicted values in tooltip
              if (datasetLabel.includes('Confidence')) {
                return null;
              }
              
              return `${datasetLabel}: ${value.toFixed(1)}%`;
            },
            footer: function(context) {
              // Add a note for predicted values
              const datasetIndex = context[0].datasetIndex;
              const dataIndex = context[0].dataIndex;
              
              if (dataIndex > historicalEndIndex) {
                return ['(Predicted value)'];
              }
              return null;
            }
          }
        },
        annotation: {
          annotations: {
            line1: {
              type: 'line',
              xMin: labels[historicalEndIndex],
              xMax: labels[historicalEndIndex],
              borderColor: 'rgba(128, 128, 128, 0.5)',
              borderWidth: 2,
              borderDash: [6, 6],
              label: {
                content: 'Prediction Start',
                display: true,
                position: 'start',
                backgroundColor: 'rgba(128, 128, 128, 0.8)',
                font: {
                  family: "'Poppins', sans-serif",
                  size: 11
                }
              }
            }
          }
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
            },
            maxRotation: 45,
            minRotation: 45
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
  
  console.log('Prediction chart initialized');
  return chart;
}
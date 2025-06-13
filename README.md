# Time Series Forecasting of Moroccan Economic Indicators

![Forecasting](docs/source/images/image11.jpg)

## Project Overview

This project aims to develop a **robust time series forecasting system** for predicting key Moroccan economic indicators using historical data. By leveraging advanced **deep learning architectures** and a systematic **hyperparameter optimization** strategy, the project provides accurate short- and medium-term forecasts that can aid analysts, economists, and policymakers in making data-informed decisions.

---

## Objectives

- Collect and preprocess economic time series data from reliable Moroccan and global sources.
- Implement and compare multiple deep learning models for time series forecasting.
- Optimize each model using **Optuna** to achieve best-in-class performance.
- Evaluate forecasting accuracy using RMSE, MAE, and MAPE.
- Select the best-performing model for each economic indicator.

---

## Models Implemented

The project focuses exclusively on **deep learning approaches**. The following models were implemented and tuned:

- **RNN (Recurrent Neural Network)**: A basic sequence model maintaining internal states, useful for short patterns.
- **LSTM (Long Short-Term Memory)**: Addresses long-term dependencies and vanishing gradient issues.
- **BiLSTM (Bidirectional LSTM)**: Processes sequences in both forward and backward directions for enhanced context.
- **LSTM-CNN Hybrid**: Combines convolutional layers for feature extraction with LSTM for sequential learning.
- **GRU (Gated Recurrent Unit)**: A more efficient alternative to LSTM with similar performance and fewer parameters.
- **TCN (Temporal Convolutional Network)**: Uses dilated causal convolutions for parallel and long-range sequence modeling.
- **Transformer**: Applies self-attention mechanisms to learn complex interdependencies without recurrence.

---

##  Optimization Strategy

All models were tuned using **Optuna**, a modern hyperparameter optimization library. Key techniques:

- **Time series-aware cross-validation** to avoid leakage.
- **Pruning and early stopping** to reduce training time.
- **Search space design** for hyperparameters like learning rate, dropout, number of layers, etc.
- **Model-specific objective functions** using metrics like RMSE and MAE.
- **GPU acceleration** for faster parallel tuning.

---

## Economic Indicators Forecasted

Examples of economic indicators targeted in this project include:

- Gross Domestic Product (GDP)
- Inflation rate
- Unemployment rate
- Exchange rate
- Industrial production index
- Consumer Price Index (CPI)

---

## Project Structure

```

.
├── data/                     # Raw and processed time series datasets
├── models/                   # Saved model weights and architecture definitions
├── notebooks/                # Jupyter notebooks for exploration and evaluation
├── scripts/                  # Python scripts for training, evaluation, and preprocessing
├── docs/
│   └── source/
│       ├── images/
│       ├── introduction.rst
│       ├── models.rst
│       └── conf.py
├── README.md                 # Project overview
└── requirements.txt          # Python dependencies

````

---

## Technologies Used

- Python (NumPy, Pandas, Matplotlib, Scikit-learn)
- PyTorch / TensorFlow
- Optuna
- Sphinx (for documentation)
- Jupyter Notebooks

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/med-reda-nk/M_eco.git
cd M_eco

# Install dependencies
pip install -r requirements.txt
````



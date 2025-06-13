# Time Series Forecasting of Moroccan Economic Indicators

![Forecasting](Documentation/images/image11.jpg)

## Project Overview

This project aims to forecast **key Moroccan economic indicators** using historical time series data and **deep learning models**. The project features both a robust **backend prediction engine** and a **web-based interactive dashboard** for visualizing model results.

---

## Objectives

- Predict indicators like GDP, inflation, and unemployment using DL models (LSTM, GRU, TCN, etc.).
- Tune models using Optuna with cross-validation.
- Develop a React-based web interface for forecast visualization.
- Document all stages using Sphinx and Jupyter Notebooks.

---

## Models Implemented

The project includes the following deep learning models:

- RNN
- LSTM
- BiLSTM
- LSTM-CNN Hybrid
- GRU
- TCN (Temporal Convolutional Network)
- Transformer

All models are optimized with **Optuna** and evaluated using RMSE, MAE, and MAPE.

---

## Project Structure

```bash
.
├── Dataset/
│   └── Dataset_Timeseries.csv
│
├── Documentation/                 # Sphinx reStructuredText docs
│   ├── images/
│   ├── Approaches and Models.rst
│   ├── Dashboard.rst
│   ├── Future Improvements.rst
│   ├── indicators.rst
│   ├── Introduction.rst
│   ├── conf.py
│   └── index.rst
│
├── Interface/                     # Frontend (likely React)
│   ├── public/
│   ├── server.js                  # Express/Node.js backend
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   └── charts/
│   │   │       ├── mainChart.js
│   │   │       └── predictionChart.js
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── main.js
│   ├── index.html
│   ├── package.json
│   └── styles.css
│
├── Notebooks/
│   ├── all-in-one.ipynb
│   ├── by_indicator.ipynb
│   ├── correlation_grouping-keynb.ipynb
│
├── .gitignore
├── azurehoceyaml
├── README.md
└── requirements.txt

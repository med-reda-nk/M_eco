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
```

---

## How to Run

### Install Dependencies

```bash
pip install -r requirements.txt
cd Interface
npm install
```

### Run Backend (if using `server.js`)

```bash
node server.js
```

### Run Frontend (React)

```bash
cd Interface
npm start
```

---

## Dataset

The dataset is stored in `Dataset/Dataset_Timeseries.csv` and includes historical time series for multiple Moroccan economic indicators.

---

## Documentation

Documentation is written using **Sphinx** with `.rst` files under `Documentation/`. To build it locally:

```bash
cd Documentation
make html
```

---

## Notebooks

Exploratory and training notebooks are available under `/Notebooks`, including:

- `all-in-one.ipynb`: full model pipeline
- `by_indicator.ipynb`: training per indicator
- `correlation_grouping-keynb.ipynb`: preprocessing and feature grouping

---

## Technologies Used

- Python (Pandas, NumPy, Matplotlib, Scikit-learn)
- Deep Learning: PyTorch / TensorFlow
- Optuna (hyperparameter tuning)
- Node.js (Express backend)
- React (Frontend dashboard)
- Sphinx (Technical documentation)
- Jupyter Notebooks
- streamlit : test interface

---

## Requirements

See [`requirements.txt`](./requirements.txt) for Python dependencies.

---

## Future Improvements

See `Documentation/Future Improvements.rst` for planned enhancements such as:

- Multivariate forecasting
- Exogenous feature integration
- Interactive user inputs in dashboard



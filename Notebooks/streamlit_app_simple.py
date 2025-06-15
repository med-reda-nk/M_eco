import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import warnings
import os
warnings.filterwarnings('ignore')

# Imports optionnels
try:
    import tensorflow as tf
    from tensorflow.keras.models import load_model
    TF_AVAILABLE = True
except ImportError:
    TF_AVAILABLE = False

try:
    from sklearn.preprocessing import MinMaxScaler
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False

try:
    import pickle
    PICKLE_AVAILABLE = True
except ImportError:
    PICKLE_AVAILABLE = False

# Configuration de la page
st.set_page_config(
    page_title="M-eco",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# CSS personnalisé
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        color: #1f77b4;
        text-align: center;
        margin-bottom: 2rem;
    }
    .metric-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 1rem;
        border-radius: 10px;
        color: white;
        text-align: center;
        margin: 0.5rem 0;
    }
    .success-box {
        background-color: #d4edda;
        border: 1px solid #c3e6cb;
        border-radius: 5px;
        padding: 1rem;
        margin: 1rem 0;
    }
</style>
""", unsafe_allow_html=True)

# Titre principal
st.markdown('<h1 class="main-header">📊 Interface de Prévision des Indicateurs Économiques du Maroc</h1>', unsafe_allow_html=True)
st.markdown("---")

@st.cache_data
def load_data():
    """Charger et préparer les données"""
    try:
        file_path = "Dataset_Timeseries.csv"
        if not os.path.exists(file_path):
            st.error(f"❌ Fichier {file_path} non trouvé!")
            return None, None
            
        df = pd.read_csv(file_path)
        
        # Nettoyage des données
        df.rename(columns={df.columns[0]: 'date'}, inplace=True)
        df['date'] = pd.to_datetime(df['date'], errors='coerce')
        df.set_index('date', inplace=True)
        df.sort_index(inplace=True)
        
        # Nettoyage numérique
        num_cols = df.columns.tolist()
        for col in num_cols:
            df[col] = pd.to_numeric(df[col].astype(str).str.replace(' ', '').str.replace('\xa0', ''), errors='coerce')
        
        # Supprimer les lignes avec toutes les valeurs NaN
        df = df.dropna(how='all')
        
        # Fill forward puis backward pour les valeurs manquantes
        df = df.fillna(method='ffill').fillna(method='bfill')
        
        return df, num_cols
        
    except Exception as e:
        st.error(f"❌ Erreur lors du chargement des données: {e}")
        return None, None

@st.cache_data
def load_predictions():
    """Charger les données de prévision"""
    try:
        file_path = "predictions.csv"
        if not os.path.exists(file_path):
            st.error(f"❌ Fichier {file_path} non trouvé!")
            return None, None
        df_pred = pd.read_csv(file_path)
        df_pred['Date'] = pd.to_datetime(df_pred['Date'])
        df_pred.set_index('Date', inplace=True)
        df_pred.sort_index(inplace=True)
        pred_cols = df_pred.columns.tolist()
        return df_pred, pred_cols
    except Exception as e:
        st.error(f"❌ Erreur lors du chargement des prévisions: {str(e)}")
        return None, None

def get_model_mapping():
    """Obtenir le mapping des meilleurs modèles par indicateur"""
    default_mapping = {
        "IDE(USD)": "LSTM-CNN",
        "REER(2010 = 100)": "LSTM-CNN", 
        "brent_oil_prices(USD/barrel)": "GRU",
        "crude_oil_prices(USD/barrel)": "RNN",
        "daily_natural_gas_prices(USD/MMBtu)": "TCN",
        "annual_gold_prices(USD/oz)": "Transformer",
        "wheat_production (Million Bushels)": "LSTM-CNN",
        "InterTourismeReceipts(usd)": "LSTM-CNN",
        "Inflation, prix à la consommation (% annuel)": "BiLSTM",
        "Chômage, total (% de la population)": "TCN",
        "Chômage, total jeune entre 15-24 (% de la population)": "GRU",
        "Demographie": "LSTM-CNN",
        "Pauvrete": "LSTM-CNN", 
        "Analphabetisme": "LSTM-CNN",
        "Consommation finals des ménages": "LSTM-CNN",
        "event": "GRU",
        "Dépenses nationales brutes (unités de devises locales courantes)": "LSTM-CNN",
        "Exportation de biens et de services ($ US)": "LSTM-CNN",
        "Importation de bien et de services ($ US)": "LSTM-CNN"
    }
    
    if PICKLE_AVAILABLE:
        try:
            with open('best_models_config.pkl', 'rb') as f:
                config = pickle.load(f)
            return config['best_model_per_indicator']
        except FileNotFoundError:
            pass
    
    return default_mapping

@st.cache_resource
def load_models_info():
    """Charger les informations sur les modèles disponibles"""
    models_info = {}
    
    model_files = {
        'LSTM': 'best_lstm_model.h5',
        'BiLSTM': 'best_bilstm_model.h5', 
        'LSTM-CNN': 'best_lstm_cnn_model.h5',
        'GRU': 'best_gru_model.h5',
        'RNN': 'best_rnn_model.h5',
        'Transformer': 'best_transformer_model.h5'
    }
    
    available_models = []
    missing_models = []
    
    for model_name, file_path in model_files.items():
        if os.path.exists(file_path):
            models_info[model_name] = file_path
            available_models.append(model_name)
        else:
            missing_models.append(model_name)
    
    return models_info, available_models, missing_models

def create_simple_forecast(data, periods=12):
    """Créer des prévisions simples basées sur les tendances historiques"""
    # Méthode simple : extrapolation linéaire basée sur les dernières valeurs
    recent_data = data.tail(min(50, len(data)))
    if len(recent_data) < 2:
        return np.full(periods, data.iloc[-1] if len(data) > 0 else 0)
    
    # Calcul de la tendance
    x = np.arange(len(recent_data))
    y = recent_data.values
    
    # Régression linéaire simple
    if len(y) > 1:
        slope = (y[-1] - y[0]) / (len(y) - 1)
        intercept = y[-1]
        
        # Prédictions futures
        future_x = np.arange(len(y), len(y) + periods)
        predictions = intercept + slope * (future_x - len(y) + 1)
        
        # Ajouter un peu de variance pour rendre plus réaliste
        noise = np.random.normal(0, np.std(y) * 0.1, periods)
        predictions += noise
        
        return predictions
    else:
        return np.full(periods, y[0])

def main():
    # Vérifier les dépendances
    missing_deps = []
    if not TF_AVAILABLE:
        missing_deps.append("TensorFlow")
    if not SKLEARN_AVAILABLE:
        missing_deps.append("scikit-learn")
    
    if missing_deps:
        st.warning(f"⚠️ Modules manquants: {', '.join(missing_deps)}. Fonctionnalités limitées.")
    
    # Charger les données
    with st.spinner("🔄 Chargement des données..."):
        df, num_cols = load_data()
        df_pred, pred_cols = load_predictions()
    
    if df is None:
        st.error("❌ Impossible de charger les données.")
        st.info("Assurez-vous que le fichier 'Dataset_Timeseries.csv' est présent dans le répertoire.")
        return
    
    # Informations sur les modèles
    models_info, available_models, missing_models = load_models_info()
    model_mapping = get_model_mapping()
    
    # Interface utilisateur
    st.sidebar.header("🎛️ Paramètres")
    
    # Information sur les modèles
    if available_models:
        st.sidebar.success(f"✅ Modèles disponibles: {', '.join(available_models)}")
    if missing_models:
        st.sidebar.warning(f" Modèles Disponibles: {', '.join(missing_models)}")
    
    # Sélection des indicateurs
    st.sidebar.subheader("📈 Indicateurs à analyser")
    
    # Grouper les indicateurs par catégorie
    economic_indicators = [col for col in num_cols if any(term in col.lower() for term in ['ide', 'reer', 'inflation', 'chomage'])]
    commodity_indicators = [col for col in num_cols if any(term in col.lower() for term in ['oil', 'gold', 'wheat', 'gas'])]
    social_indicators = [col for col in num_cols if any(term in col.lower() for term in ['demographie', 'pauvrete', 'analphabetisme'])]
    trade_indicators = [col for col in num_cols if any(term in col.lower() for term in ['export', 'import', 'tourism'])]
    other_indicators = [col for col in num_cols if col not in economic_indicators + commodity_indicators + social_indicators + trade_indicators]
    
    # Sélecteur par catégorie
    category = st.sidebar.selectbox(
        "Catégorie d'indicateurs:",
        ["Tous", "Économiques", "Matières premières", "Sociaux", "Commerce", "Autres"]
    )
    
    if category == "Économiques":
        available_indicators = economic_indicators
    elif category == "Matières premières":
        available_indicators = commodity_indicators
    elif category == "Sociaux":
        available_indicators = social_indicators
    elif category == "Commerce":
        available_indicators = trade_indicators
    elif category == "Autres":
        available_indicators = other_indicators
    else:
        available_indicators = num_cols
    
    selected_indicators = st.sidebar.multiselect(
        "Choisissez un ou plusieurs indicateurs:",
        options=available_indicators,
        default=[available_indicators[0]] if available_indicators else []
    )
    
    if not selected_indicators:
        st.warning("⚠️ Veuillez sélectionner au moins un indicateur.")
        return
    
    # Paramètres de prévision
    st.sidebar.subheader("🔮 Paramètres de prévision")
    forecast_start = st.sidebar.selectbox(
        "Date de début des prévisions:",
        options=["2023-01-01", "2024-01-01"],
        index=0
    )
    
    forecast_periods = st.sidebar.slider(
        "Nombre de mois à prédire:",
        min_value=1,
        max_value=36,
        value=12
    )
    
    # Options d'affichage
    st.sidebar.subheader("🎨 Options d'affichage")
    show_statistics = st.sidebar.checkbox("Afficher les statistiques", value=True)
    show_trends = st.sidebar.checkbox("Afficher les tendances", value=True)
    show_recent_data = st.sidebar.checkbox("Limiter aux données récentes", value=True)
    
    # Statistiques générales
    if show_statistics:
        st.header("📊 Vue d'ensemble des données")
        
        col1, col2, col3, col4 = st.columns(4)
        with col1:
            st.metric("📅 Période", f"{df.index.min().strftime('%Y-%m-%d')} à {df.index.max().strftime('%Y-%m-%d')}")
        with col2:
            st.metric("📈 Nombre d'observations", f"{len(df):,}")
        with col3:
            st.metric("📊 Indicateurs totaux", f"{len(num_cols)}")
        with col4:
            st.metric("✅ Indicateurs sélectionnés", f"{len(selected_indicators)}")
    
    # Section des données historiques
    st.header("📈 Analyse des Données Historiques")
    
    for indicator in selected_indicators:
        st.subheader(f"📊 {indicator}")
        
        # Obtenir le modèle recommandé
        recommended_model = model_mapping.get(indicator, "LSTM")
        model_available = recommended_model in available_models
        
        col1, col2 = st.columns([4, 1])
        
        with col1:
            # Préparer les données
            indicator_data = df[indicator].dropna()
            
            if show_recent_data and len(indicator_data) > 200:
                plot_data = indicator_data.tail(200)
            else:
                plot_data = indicator_data
            
            # Graphique principal
            fig = go.Figure()
            
            # Données historiques
            fig.add_trace(go.Scatter(
                x=plot_data.index,
                y=plot_data.values,
                mode='lines',
                name='Données historiques',
                line=dict(color='#1f77b4', width=2),
                hovertemplate='Date: %{x}<br>Valeur: %{y:,.2f}<extra></extra>'
            ))
            
            # Ligne de tendance si demandée
            if show_trends and len(plot_data) > 2:
                x_numeric = np.arange(len(plot_data))
                z = np.polyfit(x_numeric, plot_data.values, 1)
                p = np.poly1d(z)
                fig.add_trace(go.Scatter(
                    x=plot_data.index,
                    y=p(x_numeric),
                    mode='lines',
                    name='Tendance',
                    line=dict(color='red', width=1, dash='dash'),
                    opacity=0.7
                ))
            
            fig.update_layout(
                title=f"Évolution - {indicator}",
                xaxis_title="Date",
                yaxis_title=indicator,
                hovermode='x unified',
                height=400,
                showlegend=True
            )
            
            st.plotly_chart(fig, use_container_width=True)
        
        with col2:
            # Métriques et informations
            if len(indicator_data) > 0:
                recent_value = indicator_data.iloc[-1]
                mean_value = indicator_data.mean()
                std_value = indicator_data.std()
                
                st.metric(
                    "📊 Valeur récente",
                    f"{recent_value:,.2f}",
                    delta=f"{((recent_value - mean_value) / mean_value * 100):+.1f}%" if mean_value != 0 else None
                )
                
                st.metric("📈 Moyenne", f"{mean_value:,.2f}")
                st.metric("📐 Écart-type", f"{std_value:,.2f}")
                
                # Information sur le modèle
                status_icon = "✅" if model_available else ""
                st.info(f"{status_icon} Modèle recommandé: **{recommended_model}**")
    
    # Section des prévisions
    st.header("🔮 Prévisions")
    
    st.header("� Visualisation des Prévisions générées")
    
    # Section d'information
    st.markdown("---")
    st.header("ℹ️ Informations")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("📊 À propos des données")
        st.info("""
        Cette interface utilise des données d'indicateurs économiques du Maroc.
        Les prévisions sont générées en utilisant des modèles de deep learning
        pré-entraînés ou des méthodes d'extrapolation statistique.
        """)
    
    with col2:
        st.subheader("🎯 Utilisation")
        st.info("""
        1. Sélectionnez les indicateurs à analyser
        2. Configurez l'horizon de prévision
        3. Cliquez sur "Générer les prévisions"
        4. Analysez les résultats et comparaisons
        """)
    
    # Footer
    st.markdown("---")
    st.markdown(
        """
        <div style='text-align: center; color: #666666;'>
            📊 Interface de Prévision des Indicateurs Économiques du Maroc | 
            Développé avec Streamlit et Python
        </div>
        """,
        unsafe_allow_html=True
    )

    # Section de visualisation des prévisions
    st.markdown("## 📈 Visualisation des Prévisions")
    st.markdown("---")

    if df_pred is not None and pred_cols is not None:
        # Sélection des indicateurs pour la prévision
        selected_indicators = st.multiselect(
            "Sélectionnez les indicateurs à visualiser",
            options=pred_cols,
            default=pred_cols[0] if pred_cols else None
        )

        if selected_indicators:
            # Sélection de la période
            min_date = df_pred.index.min()
            max_date = df_pred.index.max()
            
            col1, col2 = st.columns(2)
            with col1:
                start_date = st.date_input(
                    "Date de début",
                    value=min_date,
                    min_value=min_date,
                    max_value=max_date
                )
            with col2:
                end_date = st.date_input(
                    "Date de fin",
                    value=max_date,
                    min_value=min_date,
                    max_value=max_date
                )

            # Filtrer les données en fonction de la sélection            # Filtrer les données selon la période sélectionnée
            mask = (df_pred.index >= pd.Timestamp(start_date)) & (df_pred.index <= pd.Timestamp(end_date))
            df_filtered = df_pred.loc[mask]

            # Création du graphique
            fig = go.Figure()

            for indicator in selected_indicators:
                fig.add_trace(go.Scatter(
                    x=df_filtered.index,
                    y=df_filtered[indicator],
                    name=indicator,
                    mode='lines+markers',
                    hovertemplate='Date: %{x}<br>Valeur: %{y:,.2f}<extra></extra>'
                ))

            fig.update_layout(
                title=f"Prévisions des indicateurs sélectionnés",
                xaxis_title="Date",
                yaxis_title="Valeur",
                hovermode='x unified',
                showlegend=True,
                template='plotly_white',
                height=600
            )

        st.plotly_chart(fig, use_container_width=True)

        # Affichage des données en tableau
        st.markdown("### Données détaillées")
        st.dataframe(df_filtered[selected_indicators], use_container_width=True)
    else:
        st.error("❌ Impossible de charger les données de prévision. Veuillez vérifier le fichier predictions_2023_2025.csv")

if __name__ == "__main__":
    main()

# conf.py

# -- General configuration ------------------------------------------------

extensions = [
    "sphinx_rtd_theme",  # Ajout du thème ReadTheDocs
]

# The master toctree document.
master_doc = 'index'

# Informations générales
project = 'M-eco'
copyright = '2025, Mohamed Reda Nkira - Zouga Mouhcine'
author = 'Mohamed Reda Nkira - Zouga Mouhcine'

version = '0.1'
release = '0.1.0'

language = 'fr'  # Spécifie le français pour la génération de contenu

# -- Options pour le rendu HTML -------------------------------------------

html_theme = 'sphinx_rtd_theme'
html_theme_options = {
    'collapse_navigation': False,
    'navigation_depth': 3,
    'style_external_links': True,
}

html_static_path = ['_static']  # Assure-toi que ce dossier existe ou enlève cette ligne
htmlhelp_basename = 'M-ecoDoc'

# -- Options pour le rendu LaTeX ------------------------------------------

latex_elements = {
    'papersize': 'a4paper',
    'pointsize': '11pt',
    'preamble': '',
}

latex_documents = [
    (master_doc, 'M-eco.tex', 'Documentation M_eco',
     author, 'manual'),
]

# -- Options pour le rendu man --------------------------------------------

man_pages = [
    (master_doc, 'M-eco', 'Documentation M_eco',
     [author], 1)
]

# -- Options pour le rendu Texinfo ----------------------------------------

texinfo_documents = [
    (master_doc, 'M-eco', 'Documentation M_eco',
     author, 'GuardVision', 'Système de prédiction des indicateurs economiques du Maroc.',
     'Miscellaneous'),
]

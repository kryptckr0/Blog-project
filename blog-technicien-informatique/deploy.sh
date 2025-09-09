#!/bin/bash

# Configuration du déploiement
# Modifiez ces valeurs avec vos vraies informations :
VPS_USER="kryptckr"          # ou votre nom d'utilisateur
VPS_HOST="51.38.38.166" # IP de votre VPS
VPS_PATH="/var/www/html" # Chemin sur votre VPS
LOCAL_PATH="."

echo "🚀 Déploiement du blog Tech & DevOps..."

# 1. Minification des assets
echo "📦 Minification des fichiers..."
npx clean-css-cli css/styles.css -o css/styles.min.css
npx terser js/main.js -c -m -o js/main.min.js

# 2. Validation HTML
echo "✅ Validation HTML..."
npx html-validate index.html

# 3. Transfert vers le VPS
echo "📡 Transfert vers le VPS..."
rsync -avz --delete \
  --exclude '.git' \
  --exclude 'README.md' \
  --exclude '*.md' \
  --exclude 'docs/' \
  --exclude 'deploy.sh' \
  --progress \
  $LOCAL_PATH/ $VPS_USER@$VPS_HOST:$VPS_PATH/

# 4. Redémarrage du serveur web (optionnel)
echo "🔄 Redémarrage du serveur web..."
ssh $VPS_USER@$VPS_HOST "sudo systemctl reload nginx"

echo "✨ Déploiement terminé !"
echo "🌐 Votre site est maintenant accessible sur votre VPS"

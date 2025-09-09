# 🚀 Blog Tech & DevOps

> **Blog personnel d'un technicien informatique passionné par DevOps**


## ✨ Aperçu

Blog moderne et responsive présentant mon parcours de technicien informatique vers le DevOps, avec des articles techniques détaillés et des guides pratiques.

### 🎯 Caractéristiques

- 📱 **Design responsive** avec animations CSS personnalisées
- 🎨 **Visuels SVG animés** créés sur mesure pour chaque article
- ⚡ **Performance optimisée** avec du JavaScript vanilla
- 🌐 **SEO friendly** avec métadonnées Open Graph
- 📝 **3 articles complets** prêts à lire
- 🎭 **Effets interactifs** modernes

## 🏗️ Structure du projet

```
📁 blog-technicien-informatique/
├── 📄 index.html                 # Page principale
├── 📁 articles/                  # Articles HTML complets
│   ├── 📝 kubernetes-debutants.html
│   ├── 📝 ansible-automatisation.html  
│   └── 📝 evolution-devops.html
├── 📁 css/
│   ├── 🎨 styles.css            # Styles principaux
│   └── 📦 styles.min.css        # Version minifiée
├── 📁 js/
│   ├── ⚡ main.js               # JavaScript principal 
│   └── 📦 main.min.js           # Version minifiée
├── 📁 images/
│   ├── 📁 hero/                 # Images de fond
│   └── 📁 articles/             # Illustrations SVG personnalisées
├── 📁 posts/                    # Sources Markdown
└── 🚀 deploy.sh                 # Script de déploiement
```

## 🎨 Aperçu visuel

### 🏠 Page d'accueil
- **Hero section** avec background SVG animé
- **Pipeline DevOps** interactif 
- **Grille de compétences** avec icônes dégradées
- **Cartes articles** avec images personnalisées

### 📝 Articles disponibles

1. **🚢 Introduction à Kubernetes pour les débutants**
   - Concepts fondamentaux (Pods, Deployments, Services)
   - Installation et premiers pas
   - Exemples pratiques complets
   - Outils utiles et ressources

2. **🔧 Automatiser la gestion des serveurs avec Ansible** 
   - Installation et configuration
   - Playbooks pratiques du quotidien
   - Organisation avec les rôles
   - Bonnes pratiques et sécurité

3. **📈 Évoluer de technicien à DevOps Engineer**
   - Parcours personnel détaillé
   - Plan d'action concret sur 18-24 mois
   - Compétences à développer
   - Ressources et certifications

## 🛠️ Technologies utilisées

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![SVG](https://img.shields.io/badge/SVG-FFB13B?style=for-the-badge&logo=svg&logoColor=black)

### 🎯 Fonctionnalités techniques

- **CSS Grid & Flexbox** pour la mise en page
- **CSS Variables** pour la cohérence des couleurs
- **Intersection Observer API** pour les animations
- **SVG animations** avec CSS et JavaScript
- **Progressive Enhancement** 
- **Mobile-first responsive design**

## 🚀 Installation et lancement

### Méthode 1: Serveur local simple
```bash
# Clone le repository
git clone https://github.com/kryptckr0/blog-technicien-informatique.git
cd blog-technicien-informatique

# Lance un serveur HTTP local
python3 -m http.server 8000
# ou
python -m SimpleHTTPServer 8000

# Ouvre http://localhost:8000
```

### Méthode 2: Live Server (VSCode)
```bash
# Avec l'extension Live Server de VSCode
# Clic droit sur index.html → "Open with Live Server"
```

## 📦 Déploiement

### Script automatique
```bash
# Déploiement vers VPS
./deploy.sh
```

Le script effectue :
1. Minification CSS/JS avec clean-css et terser
2. Validation HTML
3. Transfert rsync vers le serveur
4. Redémarrage nginx

### GitHub Pages
Le site est automatiquement déployable sur GitHub Pages depuis la branche `main`.

## 🎯 Roadmap

- [ ] 🌍 Traduction anglaise
- [ ] 📊 Analytics et métriques
- [ ] 💬 Système de commentaires
- [ ] 🔍 Recherche dans les articles
- [ ] 📱 PWA (Progressive Web App)
- [ ] 🎨 Mode sombre/clair
- [ ] 📧 Newsletter subscription

## 🤝 Contribution

Les contributions sont les bienvenues ! 

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/amazing-feature`)
3. Committez (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`) 
5. Ouvrez une Pull Request

## 📄 License

Distribué sous licence MIT. Voir `LICENSE` pour plus d'informations.

## 👨‍💻 Auteur

**kryptckr0** - *Technicien informatique passionné par DevOps*

- 📧 Email: [kryptckr0@proton.me](mailto:kryptckr0@proton.me)
- 🐙 GitHub: [@kryptckr0](https://github.com/kryptckr0)
- 🌐 Website: [tech-devops-blog.fr](https://tech-devops-blog.fr)

---

⭐ **Si ce projet vous plaît, n'hésitez pas à lui donner une étoile !**

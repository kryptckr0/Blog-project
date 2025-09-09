# Introduction à Kubernetes pour les débutants

*Publié le 15 décembre 2024 | Catégorie: DevOps*

## Qu'est-ce que Kubernetes ?

Kubernetes, souvent abrégé K8s, est une plateforme open-source d'orchestration de conteneurs qui automatise le déploiement, la mise à l'échelle et la gestion des applications conteneurisées. Développé à l'origine par Google et maintenant maintenu par la Cloud Native Computing Foundation (CNCF), Kubernetes est devenu l'outil de référence pour la gestion des conteneurs en production.

## Pourquoi Kubernetes ?

### Les défis sans orchestration

Avant Kubernetes, gérer des conteneurs en production était complexe :
- **Gestion manuelle** des conteneurs sur plusieurs serveurs
- **Pas de récupération automatique** en cas de panne
- **Mise à l'échelle manuelle** et fastidieuse
- **Gestion réseau complexe** entre les conteneurs

### Les avantages de Kubernetes

🚀 **Orchestration automatique** : Déploiement et gestion automatiques des conteneurs
🔄 **Auto-réparation** : Redémarrage automatique des conteneurs défaillants
📈 **Mise à l'échelle automatique** : Ajustement automatique du nombre d'instances
🌐 **Load balancing** : Distribution intelligente du trafic
🔐 **Gestion des secrets** : Stockage sécurisé des informations sensibles

## Les concepts fondamentaux

### 1. Cluster
Un cluster Kubernetes est un ensemble de machines (nœuds) qui exécutent des applications conteneurisées.

### 2. Pod
Le Pod est la plus petite unité déployable dans Kubernetes. Il contient un ou plusieurs conteneurs étroitement liés.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mon-app-pod
spec:
  containers:
  - name: mon-app
    image: nginx:latest
    ports:
    - containerPort: 80
```

### 3. Deployment
Un Deployment gère les Pods et assure leur disponibilité.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.20
        ports:
        - containerPort: 80
```

### 4. Service
Un Service expose les Pods sur le réseau de manière stable.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: LoadBalancer
```

## Architecture de Kubernetes

### Master Node (Control Plane)
- **API Server** : Interface principale de Kubernetes
- **etcd** : Base de données distribuée qui stocke l'état du cluster
- **Scheduler** : Décide sur quels nœuds placer les Pods
- **Controller Manager** : Gère les différents contrôleurs

### Worker Nodes
- **kubelet** : Agent qui communique avec l'API Server
- **kube-proxy** : Gère le routage réseau
- **Container Runtime** : Docker, containerd, ou CRI-O

## Installation et premiers pas

### 1. Installation locale avec minikube

```bash
# Installation de minikube (MacOS)
brew install minikube

# Démarrage du cluster
minikube start

# Vérification du statut
kubectl cluster-info
```

### 2. Installation de kubectl

```bash
# MacOS
brew install kubectl

# Vérification
kubectl version --client
```

### 3. Premier déploiement

```bash
# Créer un déploiement nginx
kubectl create deployment nginx --image=nginx

# Exposer le déploiement
kubectl expose deployment nginx --port=80 --type=NodePort

# Voir les pods
kubectl get pods

# Voir les services
kubectl get services
```

## Commandes essentielles

### Gestion des ressources
```bash
# Lister les ressources
kubectl get pods
kubectl get deployments
kubectl get services

# Décrire une ressource
kubectl describe pod <nom-du-pod>

# Voir les logs
kubectl logs <nom-du-pod>

# Accéder à un pod
kubectl exec -it <nom-du-pod> -- /bin/bash
```

### Application de configurations
```bash
# Appliquer un fichier YAML
kubectl apply -f deployment.yaml

# Supprimer des ressources
kubectl delete -f deployment.yaml
```

## Exemple pratique complet

Créons une application web simple avec base de données :

### 1. Déploiement de la base de données

```yaml
# db-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres-db
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:13
        env:
        - name: POSTGRES_DB
          value: "monapp"
        - name: POSTGRES_USER
          value: "admin"
        - name: POSTGRES_PASSWORD
          value: "motdepasse"
        ports:
        - containerPort: 5432
---
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
spec:
  selector:
    app: postgres
  ports:
    - port: 5432
      targetPort: 5432
```

### 2. Déploiement de l'application web

```yaml
# app-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
      - name: web-app
        image: mon-app:latest
        ports:
        - containerPort: 3000
        env:
        - name: DB_HOST
          value: "postgres-service"
---
apiVersion: v1
kind: Service
metadata:
  name: web-app-service
spec:
  selector:
    app: web-app
  ports:
    - port: 80
      targetPort: 3000
  type: LoadBalancer
```

### 3. Déploiement

```bash
# Appliquer les configurations
kubectl apply -f db-deployment.yaml
kubectl apply -f app-deployment.yaml

# Vérifier les déploiements
kubectl get all
```

## Bonnes pratiques pour débuter

### 1. Organisation des fichiers
```
k8s/
├── namespace.yaml
├── configmaps/
├── secrets/
├── deployments/
└── services/
```

### 2. Utilisation des namespaces
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: mon-app-dev
```

### 3. Gestion des ressources
```yaml
spec:
  containers:
  - name: mon-app
    image: nginx
    resources:
      limits:
        cpu: 500m
        memory: 512Mi
      requests:
        cpu: 250m
        memory: 256Mi
```

### 4. Health checks
```yaml
spec:
  containers:
  - name: mon-app
    image: nginx
    livenessProbe:
      httpGet:
        path: /health
        port: 8080
      initialDelaySeconds: 30
      periodSeconds: 10
    readinessProbe:
      httpGet:
        path: /ready
        port: 8080
      initialDelaySeconds: 5
      periodSeconds: 5
```

## Outils utiles

### 1. Lens
Interface graphique pour Kubernetes - excellent pour débuter.

### 2. k9s
Interface en ligne de commande interactive pour Kubernetes.

```bash
# Installation
brew install k9s

# Utilisation
k9s
```

### 3. Helm
Gestionnaire de packages pour Kubernetes.

```bash
# Installation
brew install helm

# Recherche de charts
helm search hub nginx

# Installation d'un chart
helm install my-nginx bitnami/nginx
```

## Ressources pour approfondir

### Documentation officielle
- [kubernetes.io](https://kubernetes.io/fr/docs/)
- [Kubernetes by Example](https://kubernetesbyexample.com/)

### Tutoriels interactifs
- [Katacoda Kubernetes](https://www.katacoda.com/courses/kubernetes)
- [Play with Kubernetes](https://labs.play-with-k8s.com/)

### Livres recommandés
- "Kubernetes in Action" par Marko Lukša
- "Kubernetes: Up and Running" par Kelsey Hightower

## Conclusion

Kubernetes peut sembler intimidant au début, mais c'est un outil puissant qui révolutionne la façon dont nous déployons et gérons les applications. Commencez petit avec minikube, expérimentez avec les concepts de base, et progressivement vous découvrirez toute la puissance de cette plateforme.

L'apprentissage de Kubernetes est un investissement qui en vaut la peine pour tout professionnel de l'IT souhaitant évoluer vers le DevOps ou l'administration d'infrastructures modernes.

---

*N'hésitez pas à poser vos questions en commentaire ou à me contacter pour des clarifications sur Kubernetes !*

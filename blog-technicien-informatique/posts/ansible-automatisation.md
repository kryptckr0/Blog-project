# Automatiser la gestion des serveurs avec Ansible

*Publié le 10 décembre 2024 | Catégorie: Infrastructure*

## Introduction

En tant que technicien informatique, l'une des révélations les plus importantes de ma carrière a été la découverte d'Ansible. Cette plateforme d'automatisation open-source développée par Red Hat a complètement transformé ma façon d'aborder l'administration système et m'a fait gagner un temps considérable au quotidien.

Dans cet article, je partage mon expérience pratique avec Ansible et comment vous pouvez l'utiliser pour automatiser vos tâches d'administration.

## Qu'est-ce qu'Ansible ?

Ansible est un outil d'automatisation IT qui permet de :
- **Configurer** des systèmes et applications
- **Déployer** des logiciels
- **Orchestrer** des tâches complexes
- **Gérer** des configurations de manière cohérente

### Pourquoi j'ai choisi Ansible

🔹 **Simplicité** : Pas d'agent à installer sur les machines cibles
🔹 **YAML** : Syntaxe claire et lisible pour les playbooks
🔹 **Idempotence** : Même résultat peu importe le nombre d'exécutions
🔹 **Polyvalence** : Compatible avec la plupart des systèmes et clouds
🔹 **Communauté** : Large écosystème de modules et rôles

## Installation et configuration

### Installation sur macOS

```bash
# Installation via Homebrew
brew install ansible

# Ou via pip
pip3 install ansible

# Vérification
ansible --version
```

### Configuration de base

Créez le fichier d'inventaire `/etc/ansible/hosts` :

```ini
[web_servers]
web1.example.com
web2.example.com

[database_servers]
db1.example.com
db2.example.com

[production:children]
web_servers
database_servers
```

Configuration SSH sans mot de passe :

```bash
# Générer une clé SSH
ssh-keygen -t rsa

# Copier la clé sur les serveurs cibles
ssh-copy-id user@server.example.com
```

## Mon premier playbook

Voici comment j'ai automatisé l'installation et la configuration de nginx :

```yaml
---
# playbook-nginx.yml
- name: Configuration serveurs web nginx
  hosts: web_servers
  become: yes
  
  tasks:
    - name: Mise à jour du cache des packages
      apt:
        update_cache: yes
        cache_valid_time: 3600
      when: ansible_os_family == "Debian"
    
    - name: Installation de nginx
      package:
        name: nginx
        state: present
    
    - name: Démarrage et activation de nginx
      service:
        name: nginx
        state: started
        enabled: yes
    
    - name: Configuration du firewall
      ufw:
        rule: allow
        port: '80'
        proto: tcp
      when: ansible_os_family == "Debian"
    
    - name: Copie du fichier de configuration personnalisé
      template:
        src: nginx.conf.j2
        dest: /etc/nginx/nginx.conf
        backup: yes
      notify:
        - restart nginx
  
  handlers:
    - name: restart nginx
      service:
        name: nginx
        state: restarted
```

Exécution du playbook :

```bash
ansible-playbook playbook-nginx.yml
```

## Cas d'usage concrets de mon quotidien

### 1. Mise à jour sécurisée des serveurs

```yaml
---
- name: Mise à jour système
  hosts: all
  become: yes
  
  tasks:
    - name: Mise à jour des packages (Debian/Ubuntu)
      apt:
        upgrade: safe
        update_cache: yes
        autoremove: yes
      when: ansible_os_family == "Debian"
    
    - name: Mise à jour des packages (CentOS/RHEL)
      yum:
        name: "*"
        state: latest
      when: ansible_os_family == "RedHat"
    
    - name: Vérification si redémarrage nécessaire
      stat:
        path: /var/run/reboot-required
      register: reboot_required
      when: ansible_os_family == "Debian"
    
    - name: Redémarrage si nécessaire
      reboot:
        reboot_timeout: 600
      when: reboot_required.stat.exists
```

### 2. Déploiement d'une application web

```yaml
---
- name: Déploiement application Node.js
  hosts: web_servers
  become: yes
  vars:
    app_name: "mon-app"
    app_user: "nodeapp"
    app_directory: "/opt/{{ app_name }}"
    
  tasks:
    - name: Création utilisateur application
      user:
        name: "{{ app_user }}"
        system: yes
        shell: /bin/bash
        home: "{{ app_directory }}"
        createhome: yes
    
    - name: Installation de Node.js
      get_url:
        url: https://nodejs.org/dist/v18.17.0/node-v18.17.0-linux-x64.tar.xz
        dest: /tmp/node.tar.xz
    
    - name: Extraction Node.js
      unarchive:
        src: /tmp/node.tar.xz
        dest: /opt/
        remote_src: yes
        owner: root
        group: root
    
    - name: Lien symbolique Node.js
      file:
        src: /opt/node-v18.17.0-linux-x64/bin/{{ item }}
        dest: /usr/local/bin/{{ item }}
        state: link
      loop:
        - node
        - npm
    
    - name: Clone du repository git
      git:
        repo: https://github.com/user/mon-app.git
        dest: "{{ app_directory }}"
        version: main
      become_user: "{{ app_user }}"
      notify:
        - restart app
    
    - name: Installation des dépendances npm
      npm:
        path: "{{ app_directory }}"
      become_user: "{{ app_user }}"
    
    - name: Création du service systemd
      template:
        src: app.service.j2
        dest: "/etc/systemd/system/{{ app_name }}.service"
      notify:
        - reload systemd
        - restart app
  
  handlers:
    - name: reload systemd
      systemd:
        daemon_reload: yes
    
    - name: restart app
      service:
        name: "{{ app_name }}"
        state: restarted
        enabled: yes
```

### 3. Sauvegarde automatisée des bases de données

```yaml
---
- name: Sauvegarde MySQL quotidienne
  hosts: database_servers
  become: yes
  vars:
    backup_directory: "/backup/mysql"
    retention_days: 7
    
  tasks:
    - name: Création du répertoire de sauvegarde
      file:
        path: "{{ backup_directory }}"
        state: directory
        mode: '0750'
        owner: root
        group: backup
    
    - name: Installation des outils MySQL
      package:
        name: mysql-client
        state: present
    
    - name: Script de sauvegarde MySQL
      template:
        src: mysql-backup.sh.j2
        dest: /usr/local/bin/mysql-backup.sh
        mode: '0750'
        owner: root
        group: backup
    
    - name: Tâche cron pour sauvegarde quotidienne
      cron:
        name: "Sauvegarde MySQL quotidienne"
        hour: "2"
        minute: "0"
        job: "/usr/local/bin/mysql-backup.sh"
        user: root
    
    - name: Script de nettoyage des anciennes sauvegardes
      template:
        src: cleanup-backups.sh.j2
        dest: /usr/local/bin/cleanup-backups.sh
        mode: '0750'
    
    - name: Tâche cron pour nettoyage hebdomadaire
      cron:
        name: "Nettoyage sauvegardes anciennes"
        weekday: "0"
        hour: "3"
        minute: "0"
        job: "/usr/local/bin/cleanup-backups.sh {{ backup_directory }} {{ retention_days }}"
```

## Organisation des playbooks avec les rôles

Pour des projets plus importants, j'utilise les rôles Ansible :

```
ansible-project/
├── inventories/
│   ├── production/
│   │   ├── hosts
│   │   └── group_vars/
│   └── staging/
│       ├── hosts
│       └── group_vars/
├── roles/
│   ├── nginx/
│   │   ├── tasks/
│   │   │   └── main.yml
│   │   ├── templates/
│   │   │   └── nginx.conf.j2
│   │   ├── handlers/
│   │   │   └── main.yml
│   │   └── defaults/
│   │       └── main.yml
│   └── mysql/
├── playbooks/
│   ├── site.yml
│   └── deploy.yml
└── ansible.cfg
```

### Exemple de rôle nginx

```yaml
# roles/nginx/tasks/main.yml
---
- name: Installation nginx
  package:
    name: nginx
    state: present

- name: Configuration nginx
  template:
    src: nginx.conf.j2
    dest: /etc/nginx/nginx.conf
  notify: restart nginx

- name: Démarrage nginx
  service:
    name: nginx
    state: started
    enabled: yes
```

```yaml
# roles/nginx/handlers/main.yml
---
- name: restart nginx
  service:
    name: nginx
    state: restarted
```

Utilisation dans un playbook :

```yaml
---
- name: Configuration serveurs web
  hosts: web_servers
  roles:
    - nginx
    - ssl-certificates
    - monitoring-agent
```

## Bonnes pratiques que j'applique

### 1. Utilisation des variables

```yaml
# group_vars/web_servers.yml
---
nginx_version: "1.18"
ssl_certificate_path: "/etc/ssl/certs"
max_connections: 1024

# host_vars/web1.example.com.yml
---
server_id: 1
local_storage: "/var/www/web1"
```

### 2. Chiffrement des données sensibles avec Ansible Vault

```bash
# Création d'un fichier chiffré
ansible-vault create secrets.yml

# Édition
ansible-vault edit secrets.yml

# Exécution avec vault
ansible-playbook --ask-vault-pass playbook.yml
```

### 3. Tests et validation

```yaml
- name: Vérification service nginx
  uri:
    url: "http://{{ inventory_hostname }}"
    method: GET
    status_code: 200
  delegate_to: localhost
```

### 4. Gestion des erreurs

```yaml
- name: Tentative de démarrage service
  service:
    name: myapp
    state: started
  register: service_start
  ignore_errors: yes

- name: Message d'erreur si échec
  debug:
    msg: "Échec du démarrage du service"
  when: service_start.failed
```

## Intégration avec d'autres outils

### 1. GitLab CI/CD

```yaml
# .gitlab-ci.yml
deploy:
  stage: deploy
  script:
    - ansible-playbook -i inventories/production playbooks/deploy.yml
  only:
    - main
```

### 2. Monitoring avec Prometheus

```yaml
- name: Installation node_exporter
  unarchive:
    src: "https://github.com/prometheus/node_exporter/releases/download/v1.3.1/node_exporter-1.3.1.linux-amd64.tar.gz"
    dest: /opt
    remote_src: yes
  
- name: Service node_exporter
  template:
    src: node_exporter.service.j2
    dest: /etc/systemd/system/node_exporter.service
  notify:
    - reload systemd
    - start node_exporter
```

## Impact sur mon travail quotidien

### Gains obtenus

- **Temps** : 70% de réduction sur les tâches répétitives
- **Erreurs** : Quasi-élimination des erreurs humaines
- **Documentation** : Les playbooks servent de documentation vivante
- **Reproductibilité** : Même configuration sur tous les environnements
- **Évolutivité** : Gestion facile de parcs de serveurs croissants

### Métriques concrètes

- Configuration d'un serveur web : **5 minutes** au lieu de 30
- Mise à jour de 20 serveurs : **10 minutes** au lieu de 3 heures
- Déploiement d'application : **2 minutes** au lieu de 15

## Ressources pour apprendre

### Documentation officielle
- [Ansible Documentation](https://docs.ansible.com/)
- [Ansible Galaxy](https://galaxy.ansible.com/) - Bibliothèque de rôles

### Formation recommandée
- Red Hat Certified Specialist in Ansible Automation
- Ansible for DevOps (livre de Jeff Geerling)

### Projets pratiques
1. Automatiser l'installation de votre stack locale
2. Créer un playbook de hardening sécurisé
3. Automatiser les sauvegardes système

## Conclusion

Ansible a révolutionné ma façon de travailler en tant que technicien informatique. Cette solution me permet non seulement de gagner du temps, mais aussi d'améliorer la qualité et la fiabilité de mes interventions.

Si vous débutez dans l'automatisation, je recommande vivement de commencer par de petites tâches simples puis d'évoluer progressivement vers des orchestrations plus complexes. L'investissement en temps d'apprentissage sera rapidement rentabilisé.

L'automatisation n'est plus un luxe dans notre métier, c'est devenu une nécessité pour rester efficace et compétitif.

---

*Vous avez des questions sur Ansible ou souhaitez partager vos propres expériences d'automatisation ? N'hésitez pas à me contacter !*

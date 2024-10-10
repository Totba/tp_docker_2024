
# Documentation : Environnement de Développement Microservices avec Docker

## Description

Ce projet configure un environnement de développement pour une application microservices comprenant :
- Un service API Node.js
- Un cache Redis
- Une base de données PostgreSQL
- Un service de monitoring avec Prometheus et Grafana

Les variables sensibles (comme les identifiants de base de données) sont sécurisées à l'aide des secrets Docker.

## Prérequis

1. Avoir Docker et Docker Compose installés.
2. Cloner ce dépôt localement.
3. Créer les fichiers de secrets pour stocker les informations sensibles.

## Étapes pour configurer les secrets

1. Créez un dossier `secrets` à la racine de votre projet :
   ```bash
   mkdir secrets
   ```

2. Créez les fichiers de secrets dans le dossier `secrets/` avec les informations sensibles :

   - `secrets/postgres_user` :
     ```bash
     myuser
     ```

   - `secrets/postgres_password` :
     ```bash
     mypassword
     ```

   - `secrets/database_url` :
     ```bash
     postgres://myuser:mypassword@db:5432/myapp
     ```

   Ces fichiers contiennent uniquement les valeurs de chaque secret.

## Structure du projet

Voici un aperçu des principaux fichiers et répertoires utilisés dans ce projet :

```
project-root/
├── api-service/          # Dossier contenant votre code API Node.js
├── db/                   # Dossier contenant les scripts d'initialisation de la DB
│   └── init.sql
├── secrets/              # Dossier contenant les fichiers de secrets
│   ├── postgres_user
│   ├── postgres_password
│   └── database_url
├── prometheus.yml        # Configuration de Prometheus
└── docker-compose.yml    # Fichier Docker Compose principal
```

## Lancer les services

### Commandes

1. **Assurez-vous que les fichiers de secrets sont prêts** dans le dossier `secrets/`.

2. Pour **construire et démarrer** tous les services définis dans `docker-compose.yml`, utilisez la commande suivante :

   ```bash
   docker-compose up --build
   ```

   Cette commande va :
   - Construire l'image de l'API Node.js (depuis `./api-service`)
   - Démarrer les services PostgreSQL, Redis, Prometheus, Grafana, et l'API

3. **Vérifier le bon fonctionnement** :
   - API Node.js accessible sur `http://localhost:3000`
   - Redis sur `localhost:6379`
   - Prometheus sur `http://localhost:9090`
   - Grafana sur `http://localhost:3001` (admin/admin pour le login par défaut)

### Arrêter les services

Pour arrêter tous les services, utilisez la commande suivante :

```bash
docker-compose down
```

### Volumes et Données

Le service PostgreSQL utilise un volume nommé `db-data` pour stocker les données de manière persistante.

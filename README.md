# =======================Évaluation Technique – Développement Backend & API=====================
                     


        Présentation du Projet

        Ce projet a été développé dans le cadre d’une évaluation technique visant à tester mes compétences en développement backend avec NestJS.
        L’objectif est de créer une API REST sécurisée permettant de :

        * Générer des utilisateurs fictifs

        * Importer ces utilisateurs en base de données

        * Gérer l’authentification avec JWT


# ====================== STACK TECHNIQUE ================
                               

                NestJS : Framework Node.js pour construire des applications serveur modulaires et maintenables

                TypeORM : ORM pour la gestion des entités et la communication avec la base de données PostgreSQL

                PostgreSQL : Base de données relationnelle

                Swagger (OpenAPI) : Documentation interactive de l’API

                Faker.js : Génération de données utilisateurs réalistes

                JWT (Json Web Token) : Authentification sécurisée basée sur token

                bcrypt : Hachage des mots de passe


# ================= Installation & Démarrage =================================

1️⃣ Prérequis

       *  Assure-toi d’avoir installé :
       *   Node.js (version ≥ 19)
       *   npm 
       *   PostgreSQL (en local)

2️⃣ Cloner le projet

# git  

# cd <nom_du_projet>

# npm install


4️⃣ Configurer l’environnement

Créer un fichier  .env à la racine du projet : 

# contenu de  .env

    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=postgres
    DB_PASSWORD=P@ssword1 
    DB_DATABASE=db_test_evaluation
    JWT_SECRET=UN EXEMPLE DE CLE SECRETS POUR LA REGENERATION DES TOKENS ET AUTRES
    JWT_EXPIRES_IN=3600s
    PORT=3001

5️⃣ Lancer le projet

    npm run start:dev

5. Le serveur démarre sur :
        http://localhost:3001

6. Accéder à la documentation Swagger
        http://localhost:3001/api


## Run tests

```bash
# unit tests
$ npm run test --passWithNoTests

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# Après clonnage : 
creer un fichier .env

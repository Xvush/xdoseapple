# Vercel Deployment Configuration for XDose

## 1. Prérequis
- Compte Vercel (https://vercel.com)
- Vercel CLI installé (`npm install -g vercel`)
- Variables d'environnement (voir `.env`)

## 2. Étapes de déploiement

### a. Initialisation du projet Vercel
1. Ouvrir un terminal à la racine du projet
2. Lancer :
   ```bash
   vercel login
   vercel
   ```
   Suivre les instructions pour lier le projet à votre compte Vercel et choisir le framework (Vite/React).

### b. Configuration des variables d'environnement
- Ajouter la variable `DATABASE_URL` dans le dashboard Vercel (Project Settings > Environment Variables)
- Copier la valeur de `.env` locale

### c. Déploiement
- Pour déployer :
   ```bash
   vercel --prod
   ```

## 3. Points d'attention
- Assurez-vous que la base PostgreSQL (Prisma Accelerate) est accessible depuis Vercel
- Adapter le code pour supporter l'exécution serverless (si besoin)
- Vérifier que les dépendances sont à jour

## 4. Liens utiles
- [Vercel Docs](https://vercel.com/docs)
- [Prisma Serverless](https://www.prisma.io/docs/orm/prisma-client/deployment/serverless)

fffff

---

*Ce fichier guide le déploiement de XDose sur Vercel étape par étape.*

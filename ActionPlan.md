# XDose – ActionPlan.md (Style Taskmaster)

Ce plan d'action détaille la migration complète de Supabase vers Prisma/PostgreSQL et la logique de fonctionnement de l'application XDose, structurée en tâches et sous-tâches fonctionnelles, inspiré du PRD. Chaque tâche est découpée pour guider le développement étape par étape.

---

## 0. Migration Supabase → Prisma/PostgreSQL

### 0.1. Nettoyage du code
- [x] Supprimer tous les imports et hooks liés à Supabase
- [x] Supprimer le dossier `src/integrations/supabase/`
- [x] Nettoyer les hooks d'authentification (`useAuth.tsx`)
- [x] Désinstaller `@supabase/supabase-js` du projet

### 0.2. Mise en place Prisma/PostgreSQL
- [x] Installer Prisma et initialiser la configuration
- [x] Créer le fichier `.env` avec la bonne `DATABASE_URL`
- [x] Définir les modèles dans `prisma/schema.prisma` (User, etc.)
- [x] Générer le client Prisma et migrer la base (reset inclus)
- [x] Implémenter les hooks et services d'authentification Prisma (hash, gestion rôle, profil creator)
- [x] Adapter les pages (Auth, etc.) pour utiliser Prisma

---

## 1. Authentification & Gestion Utilisateur

### 1.1. Authentification
- [x] Écran d'accueil avec options "S'inscrire" et "Se connecter"
- [x] Authentification par email/mot de passe (Prisma)
- [ ] Authentification sociale (Apple, Google)
- [ ] Authentification par téléphone (OTP)
- [ ] Validation 2FA (optionnel)
- [x] Gestion des erreurs et feedback utilisateur
- [x] Redirection automatique Discover/Feed après login/signup
- [x] Session persistante (localStorage, expiration auto 2h, reset sur activité)

### 1.2. Création et gestion de profil
- [x] Formulaire de création de profil (pseudo, avatar)
- [ ] Modification du profil utilisateur
- [x] Gestion stricte des types de compte (créateur, viewer) — **Vérification frontend/backend**

---

## 2. Feed & Découverte

### 2.1. Feed personnalisé
- [x] Création de la page Discover (Feed général)
- [x] Intégration de Discover dans la navigation principale
- [x] Redirection post-authentification vers Discover
- [x] Affichage du feed vertical (photos, vidéos, textes)
- [ ] Interactions : like, commenter, partager, sauvegarder
- [ ] Tap pour afficher les détails d'une publication
- [ ] Algorithme de tri (statique pour prototype)

### 2.2. Stories
- [ ] Affichage des stories en haut du feed
- [ ] Navigation gestuelle (tap, swipe)
- [ ] Affichage plein écran, barre de progression
- [ ] Réactions rapides (emoji, message)

---

## 3. Création & Upload de Contenu

### 3.1. Studio de création
- [x] Accès via bouton central "+" (visible uniquement pour créateurs)
- [x] Accès Studio via bouton "Create" sur le profil créateur propriétaire
- [x] Accès Studio via navigation (bottom bar) — **SPA**
- [x] Vérification stricte du rôle (créateur/CREATOR) côté frontend
- [x] Message d'accès refusé si non-créateur
- [x] Loading premium (spinner, fade-in)
- [x] Outils de création (Filtres, Texte, Musique, IA)
- [x] Boutons d’action (Publier, Enregistrer en brouillon)
- [x] UI premium, transitions animées

### 3.2. Upload & publication
- [ ] Upload sécurisé des médias (images, vidéos)
- [ ] Gestion des formats et compression
- [ ] Publication immédiate ou planifiée
- [ ] Feedback utilisateur (succès/erreur)

---

## 4. Navigation & SPA
- [x] Navigation fluide (SPA) entre Feed, Discover, Profile, Studio
- [x] BottomNavigation avec Studio visible uniquement pour créateurs
- [x] Header adapté à chaque vue (fallback sur "profile" pour Studio)
- [x] Correction des bugs de navigation et typage

---

## 5. Tableau de Bord Créateur

### 5.1. Analytics
- [ ] Affichage des revenus, abonnés, pourboires
- [ ] Graphiques d'évolution (statique pour prototype)
- [ ] Liste des abonnés et transactions

### 5.2. Gestion des offres
- [ ] Création/édition des niveaux d'abonnement
- [ ] Gestion des contenus PPV
- [ ] Historique des paiements (simulation)

---

## 6. Marketplace & Academy

### 6.1. Marketplace
- [ ] Navigation par catégories d'assets
- [ ] Affichage des assets (templates, musiques, effets)
- [ ] Achat et intégration dans le studio (simulation)

### 6.2. XDose Academy
- [ ] Accès à la section Academy
- [ ] Navigation par catégories de cours
- [ ] Suivi de progression utilisateur

---

## 7. Sécurité & Robustesse
- [x] Vérification du rôle sur toutes les routes sensibles (Studio)
- [x] Gestion des erreurs API et frontend
- [x] **Compatibilité Vercel :**
    - Suppression de tous les fichiers TypeScript dans `/api/` (Vercel ne supporte que CommonJS/JS pour les API routes).
    - Conversion des routes API en `.js` ou `.cjs` (ex: `/api/profile-id.js`).
    - Utilisation de `require`/`module.exports` si besoin.
    - Ajout d'un fallback SPA dans `vercel.json` pour la navigation côté client.

---

## 8. UX Premium
- [x] Loading, transitions, feedback visuel sur toutes les pages principales
- [x] Expérience testée et validée pour créateur/viewer
- [x] Correction des bugs de navigation, typage, et session

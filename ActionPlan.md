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
- [ ] Définir les modèles dans `prisma/schema.prisma` (User, etc.)
- [ ] Générer le client Prisma et migrer la base
- [ ] Implémenter les hooks et services d'authentification Prisma
- [ ] Adapter les pages (Auth, etc.) pour utiliser Prisma

---

## 1. Authentification & Gestion Utilisateur

### 1.1. Authentification
- [ ] Implémenter l'écran d'accueil avec options "S'inscrire" et "Se connecter"
- [ ] Authentification par email/mot de passe (Prisma)
- [ ] Authentification sociale (Apple, Google)
- [ ] Authentification par téléphone (OTP)
- [ ] Validation 2FA (optionnel)
- [ ] Gestion des erreurs et feedback utilisateur

### 1.2. Création et gestion de profil
- [ ] Formulaire de création de profil (pseudo, avatar)
- [ ] Modification du profil utilisateur
- [ ] Gestion des types de compte (créateur, utilisateur)

---

## 2. Feed & Découverte

### 2.1. Feed personnalisé
- [ ] Affichage du feed vertical (photos, vidéos, textes)
- [ ] Interactions : like, commenter, partager, sauvegarder
- [ ] Tap pour afficher les détails d'une publication
- [ ] Algorithme de tri (statique pour prototype)

### 2.2. Stories
- [ ] Affichage des stories en haut du feed
- [ ] Navigation gestuelle (tap, swipe)
- [ ] Affichage plein écran, barre de progression
- [ ] Réactions rapides (emoji, message)

### 2.3. Découverte IA
- [ ] Page "Découvrir" avec suggestions de contenus/créateurs
- [ ] Recherche par mots-clés
- [ ] Filtres et tri (catégories, tendances)

---

## 3. Création & Upload de Contenu

### 3.1. Studio de création
- [ ] Accès via bouton central "+"
- [ ] Sélection du type de contenu (post, story, live, NFT)
- [ ] Import/capture média (photo, vidéo)
- [ ] Outils d'édition IA (filtres, texte, templates)
- [ ] Mode Pro (contrôles avancés)
- [ ] Ajout de description, hashtags, localisation
- [ ] Prévisualisation du contenu

### 3.2. Upload & publication
- [ ] Upload sécurisé des médias (images, vidéos)
- [ ] Gestion des formats et compression
- [ ] Publication immédiate ou planifiée
- [ ] Feedback utilisateur (succès/erreur)

---

## 4. Monétisation

### 4.1. Abonnements
- [ ] Affichage des niveaux d'abonnement sur le profil créateur
- [ ] Sélection et souscription à un niveau
- [ ] Simulation du paiement (pour prototype)
- [ ] Accès au contenu exclusif après abonnement

### 4.2. Pourboires (Tips)
- [ ] Bouton pourboire sur profil/publication
- [ ] Choix du montant, message optionnel
- [ ] Simulation du paiement

### 4.3. Contenu PPV & NFT
- [ ] Marquage des contenus premium (PPV, NFT)
- [ ] Simulation d'achat/accès
- [ ] Affichage des NFT possédés

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

## 7. Paramètres & Bien-être Numérique

### 7.1. Paramètres généraux
- [ ] Gestion du compte, notifications, vie privée
- [ ] Accessibilité (sous-titres, lecteurs d'écran)

### 7.2. Bien-être numérique
- [ ] Suivi du temps passé
- [ ] Définition de limites, suggestions de pauses
- [ ] Contrôles de contenu et anti-harcèlement

---

*Chaque sous-tâche peut être développée, testée et validée indépendamment pour garantir une progression claire et mesurable du projet XDose.*

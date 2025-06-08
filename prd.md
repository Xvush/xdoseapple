# XDose – Product Requirements Document (PRD)

## 1. Mission et Vision

L'ambition de XDose est de révolutionner l'industrie du contenu digital en créant une plateforme centrée sur le créateur, alliant innovation technologique, design d'exception, monétisation équitable et bien-être numérique. XDose vise à devenir la référence mondiale pour la création, le partage et la consommation de contenu premium et engageant.

## 2. Concept Central

XDose combine les forces d'Instagram (social, feed, stories), des principes Apple (design, minimalisme, performance) et d'OnlyFans (monétisation directe et équitable).

## 3. Principes de Design
- Minimalisme & clarté (inspiration Apple)
- Typographie lisible (Inter ou équivalent)
- Animations subtiles, glassmorphisme
- Palette de couleurs premium, modes clair/sombre
- Navigation gestuelle intuitive

## 4. Fonctionnalités Clés
- Feed personnalisé (photos, vidéos, texte) — **Feed vertical accessible et intégré**
- Stories immersives
- Découverte IA de contenus/créateurs
- Studio de création assisté IA (édition, templates, collaboration)
- Monétisation : abonnements flexibles, PPV, pourboires, NFT, crypto
- Tableau de bord créateur (analytics, gestion abonnements)
- Marketplace d’assets
- XDose Academy (formation créateurs)
- Paramètres avancés (bien-être numérique, accessibilité)

## Authentification & Gestion Utilisateur
- Authentification email/mot de passe (Prisma/PostgreSQL)
- Gestion des rôles (créateur, viewer) — **Vérification stricte du rôle côté frontend et backend**
- Session persistante (localStorage, expiration auto 2h, reset sur activité)
- Redirection automatique Discover/Feed après login/signup
- Gestion des erreurs et feedback utilisateur

## Navigation & SPA
- Navigation fluide (SPA) entre Feed, Discover, Profile, Studio
- BottomNavigation avec accès Studio visible uniquement pour les créateurs
- Header et navigation adaptés à chaque vue

## Studio de Création
- Accès réservé aux créateurs (message d’accès si non-créateur)
- Loading premium (spinner, fade-in)
- Outils de création (Filtres, Texte, Musique, IA)
- Boutons d’action (Publier, Enregistrer en brouillon)
- UI premium, transitions animées

## Profile
- Accès public pour les créateurs, privé pour viewers
- Bouton "Create" visible uniquement pour le créateur propriétaire
- Navigation cohérente vers /studio

## Sécurité & Robustesse
- Vérification du rôle sur toutes les routes sensibles (Studio)
- Gestion des erreurs API et frontend

## Déploiement
- Compatible Vercel (API routes CommonJS, fallback SPA)

## Notes complémentaires
- Studio et navigation SPA testés et validés (créateur/viewer)
- Correction des bugs de navigation, typage, et session
- UX premium sur toutes les pages principales

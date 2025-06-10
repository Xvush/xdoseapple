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

# Action Plan XDose (Juin 2025)

## ✅ Fait
- Refactor complet backend/frontend pour modèle User unique (suppression Creator).
- Correction du routing Vercel et des API (plus de routes dynamiques conflictuelles).
- Migration et reset de la base Prisma, schéma User unique, Video.userId.
- Correction de l’authentification (signup/signin) pour User unique.
- Correction du flow d’upload vidéo :
  - Upload Mux fonctionne pour tous les créateurs (userId).
  - Webhook Mux crée bien la vidéo dans Prisma (userId).
  - Les vidéos s’affichent sur le profil créateur.
- Suppression de tous les anciens fichiers/logiciels Creator.
- Build et déploiement validés, tests manuels OK.
- Toutes les étapes antérieures (migration Supabase, feed, discover, etc.) sont conservées ci-dessous pour historique et traçabilité.

## 🟡 À faire (prochaines étapes)
- [ ] Ajout de la gestion du titre, description, tags, etc. lors de l’upload vidéo (frontend + backend + Prisma si besoin).
- [ ] Améliorer le lecteur vidéo (player, UX, preview, etc.).
- [ ] (Optionnel) Scripts d’insertion de données de test (users, vidéos).
- [ ] (Optionnel) Rendre certains champs obligatoires dans Prisma après migration.
- [ ] Tests finaux et QA sur l’ensemble du flow créateur.

## 🟠 Prochaine priorité
- Refactor et amélioration du lecteur vidéo (player sur le profil, UX, etc.)

---

## Améliorations du lecteur vidéo

- [x] 1. Contrôles personnalisés et branding
  - Création du composant XDoseVideoPlayer réutilisable (branding, overlay logo, titre)
  - Contrôles custom premium (play/pause, volume, mute, seek, fullscreen)
  - Style responsive, ergonomie mobile, boutons adaptés
  - Logo XDose discret et non envahissant
- [x] 2. Expérience utilisateur avancée (loader, seek, miniature, reprise lecture)
  - Loader animé pendant le buffering
  - Miniature (poster) avant lecture avec bouton play premium
  - Reprise de lecture automatique (timestamp sauvegardé par vidéo)
  - Lecture auto en plein écran au démarrage
  - Affichage fluide, UX premium sur mobile et desktop
- [ ] 3. Accessibilité et internationalisation (sous-titres, clavier, mobile)
- [ ] 4. Fonctionnalités sociales et premium (partage, PiP, stats)
- [X] 5. Performance et adaptabilité (HLS/DASH, lazy loading)
- [ ] 6. Sécurité et confidentialité (désactiver clic droit, masquer URL)

---

## 9. Gestion avancée de l’édition vidéo (post-publication)

### 9.1. Wizard d’upload vidéo (UX premium)
- [x] Étape 1 : Formulaire enrichi (titre, description, tags, preview thumbnail, UX multi-tags chips)
- [x] Étape 2 : Récapitulatif avant publication (aperçu miniature, titre, tags, bouton "Publier" bien visible)
- [x] Possibilité de revenir en arrière avant validation
- [x] Bouton "Publier" accessible dès l’étape 1 pour fluidifier le flow (validation + publication directe)
- [x] Bouton "Publier" bien visible à l’étape 2 pour valider après récapitulatif
- [ ] Option "Enregistrer en brouillon" (bonus)

> **Avancement** :
> - Saisie des tags premium (chips interactives, limite, feedback, suppression, pas de doublons).
> - Preview vidéo et thumbnail dès la sélection.
> - Navigation fluide entre étapes, feedback clair, publication possible à tout moment.
> - Publication possible soit directement à l’étape 1, soit après récapitulatif à l’étape 2 (UX validée, conforme à la demande).
> - Aucune erreur bloquante, expérience premium prête pour QA.

### 9.2. Édition des métadonnées vidéo après publication
- [x] Bouton "Éditer" visible uniquement pour le créateur sur chaque vidéo de son profil
- [x] Modal ou page dédiée d’édition (pré-remplie avec les métadonnées actuelles)
- [x] Validation des champs (longueur, nombre de tags, caractères spéciaux)
- [x] Feedback utilisateur (toast succès/erreur, loading)
- [ ] Historique des modifications (optionnel, pour audit)

### 9.3. API PATCH sécurisée pour édition vidéo
- [x] Route PATCH `/api/video-edit.js` (Vercel) ou `/api/videos/:id` (Express)
- [x] Authentification obligatoire (middleware ou vérification manuelle)
- [x] Vérification que l’utilisateur est bien propriétaire de la vidéo
- [x] Validation stricte des champs (Zod ou équivalent)
- [x] Mise à jour des champs modifiables (titre, description, tags) dans Prisma
- [x] Retourne la vidéo mise à jour

### 9.4. Synchronisation UI après édition
- [x] Rafraîchissement de la liste des vidéos sur le profil (refetch ou maj state local)
- [x] Affichage d’un feedback clair (succès/erreur)

### 9.5. (Bonus) Édition inline & gestion des brouillons
- [ ] Édition inline façon Notion (bonus V2)
- [ ] Gestion des brouillons (statut, publication différée)

---

**Résumé du flow**
1. Upload vidéo : wizard 2 étapes, confirmation avant publication.
2. Après publication : bouton "Éditer" → modal/page → PATCH API → feedback → mise à jour UI.
3. Sécurité : auth, validation, autorisation propriétaire, feedback UX.
4. (Optionnel) Historique des modifications et gestion des brouillons.

---

**Prochaine étape** : commencer par la création de la route PATCH `/api/video-edit.js` (Vercel/Express compatible, validation Zod, auth, vérification propriétaire).

---

# Plan d'Amélioration du Lecteur Vidéo XDose

## Problèmes Identifiés
1. **Taille sur mobile** : Hauteur statique sans media queries
2. **Barre de progression** : Positionnement non optimal sur mobile
3. **UI avant lecture** : Trop d'éléments visuels

## Solutions Techniques

### 1. Optimisation Mobile
```css
@media (max-width: 640px) {
  .xdose-player {
    height: 60vh !important;
    touch-action: manipulation;
  }
  .controls-container {
    padding-bottom: calc(1rem + env(safe-area-inset-bottom));
  }
}
```

### 2. Améliorations UX
- Barre de progression déplacée en bas
- Auto-hide des contrôles après 3s (animation fade/slide, transition d’opacité fluide)
- Animation pulse sur bouton play
- Mode paysage automatique
- Contrôles secondaires (volume, qualité, etc.) accessibles via drawer/menu plus
- Haptique sur double tap seek (mobile/PWA si supporté)
- Tooltips accessibles (aria-describedby) sur desktop pour les contrôles principaux
- Loader circulaire affiché uniquement si buffering > 300ms
- Overlay “tap to play” avant lecture (mobile)
- Responsive avancé : certains boutons masqués en paysage ou sur petits écrans

### 3. Optimisations Techniques
- Lazy loading amélioré
- Préloader circulaire customisé
- Gestion HLS pour mobile

### 4. Accessibilité & Ergonomie
- Focus clavier et navigation ARIA sur tous les contrôles
- Contrastes vérifiés (boutons, textes, barres)
- Contrôles utilisables au doigt et au clavier
- Annonces ARIA pour les actions importantes (play, pause, seek)
- Test sur lecteurs d'écran mobiles (VoiceOver, TalkBack)

## Roadmap
1. [x] Implémenter les styles mobiles (responsive, safe-area, touch-action)
2. [x] Refonte de l'UI des contrôles (mobile first, accessibilité, ergonomie)
3. [x] Ajouter les animations (auto-hide, pulse, transitions)
4. [ ] Optimiser le chargement (lazy loading, préloader, gestion HLS)

## Bonnes Pratiques
- Utiliser `safe-area-inset` pour iOS
- `touch-action: manipulation` pour éviter les délais
- `screen.orientation.lock()` pour le mode paysage
- Tester l'accessibilité (a11y) sur mobile et desktop
- Privilégier une évolution incrémentale des contrôles pour faciliter la QA et le feedback UX

---

# Changements et Corrections Récents

## Correctifs Apportés
- [x] Bloc controls-container toujours monté, gestion de l'affichage par classes CSS (opacity/pointer-events), suppression du test showControls && (...), debug desktop OK
- [x] Contrôles premium (play/pause, volume, mute, seek, fullscreen) accessibles, overlay tap-to-play, loader circulaire, drawer volume mobile, slider volume desktop, tooltips accessibles
- [x] Animation pulse sur play/pause, fade-in, responsive, safe-area, padding, hover desktop
- [x] HLS.js intégré pour lecture universelle .m3u8
- [x] Auto-hide des contrôles (3s d’inactivité en fullscreen), apparition/disparition fluide
- [x] Correction bug volume desktop (slider visible sur sm:inline-block)
- [x] Correction de l’appel XDoseVideoPlayer dans Profile.tsx (prop src)
- [x] Tests et validation UX mobile/desktop

## Prochaines étapes (optionnel)
- [ ] Haptique double tap seek (mobile/PWA)
- [ ] Responsive avancé (masquer certains boutons en paysage/petit écran)
- [ ] Sécurité/confidentialité (désactiver clic droit, masquer URL)
- [ ] Accessibilité avancée (navigation clavier, annonces ARIA, test lecteurs d’écran)
- [ ] Fonctionnalités sociales/premium (partage, PiP, stats)
- [ ] Lazy loading/optimisation préloader
- [ ] QA finale et feedback utilisateur

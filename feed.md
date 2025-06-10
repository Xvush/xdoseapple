# Plan d’Adaptation de la Page Feed (Mobile)

## 1. Typographie
- Utiliser **SF Pro** (ou fallback : Inter, Nunito Sans, Manrope)
- Poids : medium pour les titres, regular pour le reste

## 2. Layout Général
- Vertical, padding horizontal `px-4`
- `pt-[env(safe-area-inset-top)]` pour la marge supérieure sur iOS
- Espacement vertical entre les éléments : `gap-4`

## 3. Carte Principale (Post vedette)
- Image large, ratio 4:3, coins arrondis `rounded-xl`
- Nom en gras, like (icône cœur) à droite, nombre de likes
- Temps en bas à gauche

## 4. Grille Secondaire (2x2)
- Deux cartes côte à côte, gap `gap-4`
- Ratio carré, coins arrondis `rounded-xl`
- Overlay play sur les vidéos
- Nom et temps en dessous

## 5. Couleurs et Icônes
- Fond : `bg-[#FAFAFA]`
- Texte : `text-[#222]` ou `text-[#555]`
- Icônes minimalistes (Heroicons, Lucide)

## 6. Navigation
- Barre de navigation fixe en bas, fond blanc, ombre légère `shadow-sm`
- Icônes : Home (rempli si actif), Profile

## 7. Responsive & Accessibilité
- Touch targets min 44x44px
- Safe Area Insets pour iOS
- Animation scale sur tap

## 8. Bonus
- Skeleton loader pour le chargement
- Lazy loading/pagination

---

## Exemple JSX (avec Tailwind CSS)

```jsx:feed.jsx
import { HeartIcon, UserIcon, PlayIcon, HomeIcon } from "@heroicons/react/24/solid";

export default function Feed() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-[env(safe-area-inset-top)] pb-20 px-4 font-sans">
      <header className="flex items-center justify-between mt-2 mb-4">
        <h1 className="text-2xl font-medium">Feed</h1>
        <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow">
          <UserIcon className="w-6 h-6 text-[#222]" />
        </button>
      </header>
      <main className="flex flex-col gap-4">
        {/* Carte principale */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <img src="/images/feed.png" alt="Jane Cooper" className="w-full aspect-[4/3] object-cover" />
          <div className="flex items-center justify-between px-3 py-2">
            <span className="font-medium text-[#222]">Jane Cooper</span>
            <span className="flex items-center gap-1 text-[#555]">
              <HeartIcon className="w-5 h-5" />
              212
            </span>
          </div>
          <div className="px-3 pb-2 text-xs text-[#888]">5h</div>
        </div>
        {/* Grille secondaire */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <img src="/images/profile.png" alt="Ronald Richards" className="w-full aspect-square object-cover" />
            <div className="px-3 py-2 font-medium text-[#222]">Ronald Richards</div>
            <div className="px-3 pb-2 text-xs text-[#888]">8h</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden relative">
            <img src="/images/profile.png" alt="Leslie Alexander" className="w-full aspect-square object-cover" />
            <span className="absolute inset-0 flex items-center justify-center">
              <PlayIcon className="w-12 h-12 text-white/80" />
            </span>
            <div className="px-3 py-2 font-medium text-[#222]">Leslie Alexander</div>
            <div className="px-3 pb-2 text-xs text-[#888]">12h</div>
          </div>
        </div>
      </main>
      {/* Navigation bas */}
      <nav className="fixed bottom-0 left-0 right-0 z-10 bg-white shadow-sm flex justify-around items-center h-16" style={{paddingBottom: 'env(safe-area-inset-bottom)'}}>
        <button className="flex flex-col items-center text-[#FF4D4F]">
          <HomeIcon className="w-7 h-7" />
        </button>
        <button className="flex flex-col items-center text-[#888]">
          <UserIcon className="w-7 h-7" />
        </button>
      </nav>
    </div>
  );
}
```

---

## Points Clés à Implémenter
- Utiliser Tailwind pour la rapidité
- Respecter les coins arrondis et ombres
- Overlay play sur les vidéos
- Safe Area Insets pour iOS
- Animation scale sur tap (ex: `active:scale-95`)
- Loader skeleton pour le chargement
- Pagination/lazy loading pour la performance

# CONTEXTE SYSTÈME  
Création ou adaptation de la page "Feed" mobile pour une application centrée sur les créateurs de contenu vidéo, intégrant design épuré, performance, accessibilité et interactions modernes.  
Objectif : produire une interface mobile-first qui reproduit fidèlement le layout décrit, en utilisant Tailwind CSS et React/Vite.  
Public cible : développeurs frontend, designers UI/UX, chefs de projet tech.  

# RÔLE ET EXPERTISE  
Tu es un **développeur frontend senior spécialisé en interfaces mobiles performantes**, avec expertise en :
- Intégration responsive avec Tailwind CSS
- Design système inspiré d’Apple (Human Interface Guidelines)
- Performance web (chargement, mémoire, rendering)
- Accessibilité et bien-être numérique
- Navigation gestuelle et composants réutilisables

# OBJECTIF TECHNIQUE  
Générer une page `Feed` mobile complète respectant les spécifications suivantes :
1. Structure verticale avec typographie SF Pro (ou fallback)
2. Carte principale (post vedette) avec image 4:3, nom, likes, temps
3. Grille secondaire 2x2 avec gestion de vidéos (overlay play)
4. Barre de navigation fixe en bas avec icônes actifs/inactifs
5. Skeleton loader, lazy loading/pagination, animations subtiles
6. Respect des contraintes de couleurs, espacements et accessibilité

# SPÉCIFICATIONS TECHNIQUES

## Contraintes Fonctionnelles :
- Utiliser **React + Vite + Tailwind CSS**
- Appliquer une structure verticale avec `px-4`, `pt-[env(safe-area-inset-top)]`, `gap-4`
- Ratio d'image principal : `4:3`, coins arrondis `rounded-xl`
- Ratio images secondaires : carré, overlay play si vidéo
- Typographie : **SF Pro** (fallback : Inter, Nunito Sans, Manrope), poids medium pour titres
- Couleurs : fond `bg-[#FAFAFA]`, texte `text-[#222]` et `text-[#555]`
- Icônes : minimalistes (Heroicons, Lucide), taille cohérente
- Navigation : barre fixe en bas avec Home (rempli si actif), Profile, ombre légère
- Interaction tactile : scale léger au tap (`active:scale-95`)
- Safe Area Insets iOS correctement gérés
- Lazy loading / pagination progressive
- Loader skeleton pendant le chargement initial

## Contraintes Non-Fonctionnelles :
- Format de sortie : JSX fonctionnel + explications claires
- Style : technique, orienté développement et UX
- Inclure des schémas textuels si nécessaire
- Nommer chaque section clairement (avec niveaux de titre)

# DONNÉES D'ENTRÉE
- Inspirations :
   - Documentation Apple HIG
   - Exemple JSX fourni dans les données d'entrée
   - Principes d’accessibilité WCAG

# EXEMPLE DE RÉFÉRENCE (Few-Shot)

## Exemple – Sortie attendue partielle :
```jsx
import { HeartIcon, PlayIcon, HomeIcon, UserIcon } from "@heroicons/react/24/solid";

export default function Feed() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-[env(safe-area-inset-top)] pb-20 px-4 font-sans">
      <header className="flex items-center justify-between mt-2 mb-4">
        <h1 className="text-2xl font-medium text-[#222]">Feed</h1>
        <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow">
          <UserIcon className="w-6 h-6 text-[#222]" />
        </button>
      </header>
      <main className="flex flex-col gap-4">
        {/* Carte principale */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <img src="/images/feed.png" alt="Jane Cooper" className="w-full aspect-[4/3] object-cover" />
          <div className="flex items-center justify-between px-3 py-2">
            <span className="font-medium text-[#222]">Jane Cooper</span>
            <span className="flex items-center gap-1 text-[#555]">
              <HeartIcon className="w-5 h-5" />
              212
            </span>
          </div>
          <div className="px-3 pb-2 text-xs text-[#888]">5h</div>
        </div>
        {/* Grille secondaire */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <img src="/images/profile.png" alt="Ronald Richards" className="w-full aspect-square object-cover" />
            <div className="px-3 py-2 font-medium text-[#222]">Ronald Richards</div>
            <div className="px-3 pb-2 text-xs text-[#888]">8h</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden relative">
            <img src="/images/profile.png" alt="Leslie Alexander" className="w-full aspect-square object-cover" />
            <span className="absolute inset-0 flex items-center justify-center">
              <PlayIcon className="w-12 h-12 text-white/80" />
            </span>
            <div className="px-3 py-2 font-medium text-[#222]">Leslie Alexander</div>
            <div className="px-3 pb-2 text-xs text-[#888]">12h</div>
          </div>
        </div>
      </main>
      {/* Navigation bas */}
      <nav className="fixed bottom-0 left-0 right-0 z-10 bg-white shadow-sm flex justify-around items-center h-16" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <button className="flex flex-col items-center text-[#FF4D4F]">
          <HomeIcon className="w-7 h-7" />
        </button>
        <button className="flex flex-col items-center text-[#888]">
          <UserIcon className="w-7 h-7" />
        </button>
      </nav>
    </div>
  );
}

Cas limite :
Un utilisateur charge la page sans connexion internet. Comment afficher un skeleton loader élégant ? 

CRITÈRES DE VALIDATION
La réponse doit inclure :

Un fichier JSX complet et fonctionnel
Des commentaires explicatifs pour chaque section
La mise en œuvre des éléments visuels clés (ratio, coins, overlays)
Les bonnes pratiques d’accessibilité (alt, aria-labels)
Des suggestions pour implémenter :
Lazy loading
Pagination
Animation scale sur tap
Support dark mode (optionnel)
Une version adaptée à l’intégration continue (ex: avec Storybook ou composants atomiques)
BONUS : Améliorations Recommandées
Implémentation d’un système de composants atomiques (Card, GridItem, Navbar, etc.)
Gestion du thème sombre/clair
Version accessible aux lecteurs d’écran
Optimisation Lighthouse ≥ 90
Tests automatisés (Jest, Cypress, Testing Library)

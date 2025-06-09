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
- Auto-hide des contrôles après 3s
- Animation pulse sur bouton play
- Mode paysage automatique

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
1. [ ] Implémenter les styles mobiles (responsive, safe-area, touch-action)
2. [ ] Refonte de l'UI des contrôles (mobile first, accessibilité, ergonomie)
3. [ ] Ajouter les animations (auto-hide, pulse, transitions)
4. [ ] Optimiser le chargement (lazy loading, préloader, gestion HLS)

## Bonnes Pratiques
- Utiliser `safe-area-inset` pour iOS
- `touch-action: manipulation` pour éviter les délais
- `screen.orientation.lock()` pour le mode paysage
- Tester l'accessibilité (a11y) sur mobile et desktop
- Privilégier une évolution incrémentale des contrôles pour faciliter la QA et le feedback UX
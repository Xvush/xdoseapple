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

## Roadmap
1. [ ] Implémenter les styles mobiles
2. [ ] Refonte de l'UI des contrôles
3. [ ] Ajouter les animations
4. [ ] Optimiser le chargement

## Bonnes Pratiques
- Utiliser `safe-area-inset` pour iOS
- `touch-action: manipulation` pour éviter les délais
- `screen.orientation.lock()` pour le mode paysage
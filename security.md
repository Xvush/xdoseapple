# XDose - Politique de Sécurité

## Protection des Vidéos

### 1. Protection Basique
- Désactivation du clic droit et raccourcis clavier
- Blocage de l'inspecteur (F12, Ctrl+U)
- Overlay transparent anti-capture

### 2. Watermarking
- Visible : ID utilisateur dynamique
- Invisible : Marque stéganographique
- Génération : FFmpeg ou Mux Image Overlay

### 3. Sécurité Mux
- Playback IDs temporaires (5min)
- Chiffrement AES-128
- Rotation automatique des clés

### 4. Détection d'Anomalies
- Fingerprinting navigateur
- Surveillance multi-géolocalisation
- Alerte sur accès simultanés

## Implémentation Technique

```javascript
// Exemple: Protection clavier dans XDoseVideoPlayer
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.ctrlKey && (e.key === 'u' || e.key === 's')) e.preventDefault();
    if (e.key === 'F12') e.preventDefault();
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

```bash
# Exemple: Watermark avec FFmpeg
ffmpeg -i input.mp4 -vf "drawtext=text='%{user_id}': fontsize=24: x=10: y=10" -c:a copy output.mp4
```

## Stratégie de Défense en Couches

Couche | Technologie | Efficacité | Coût
---|---|---|---
1 | Désactivation UI | Moyenne | Faible
2 | Watermarking | Haute | Moyen
3 | Chiffrement | Haute | Faible
4 | Détection | Haute | Élevé
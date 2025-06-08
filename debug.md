# Debug XDose – Routing API vidéos Vercel

## Problème initial
- Le frontend attendait du JSON depuis `/api/profile/[id]/videos` mais recevait du HTML (SPA fallback) ou un 404.
- Les routes dynamiques Vercel (`[id].js` et `[id]/videos.js`) entraient en conflit, empêchant le bon routing des API vidéos.

## Étapes de résolution

### 1. Diagnostic du routing
- Vérification que le HTML reçu était dû à un fallback SPA (route non trouvée).
- Ajout de logs et de feedbacks visuels côté frontend pour mieux diagnostiquer les erreurs d’API.
- Test de la structure des dossiers et fichiers dans `/api/`.

### 2. Correction du routing Vercel
- Suppression du conflit entre `/api/profile/[id].js` et `/api/profile/[id]/videos.js`.
- Déplacement de la logique vidéo dans un handler plat `/api/getProfileVideos.js`.
- Ajout d’une règle de rewrite explicite dans `vercel.json` :
  ```json
  { "source": "/api/profile-videos/:id", "destination": "/api/getProfileVideos.js?id=:id" }
  ```
- Suppression de l’ancien fichier `/api/profile/[id]/videos.js`.

### 3. Vérification du déploiement
- Test d’une route API plate `/api/hello.js` pour valider le support des serverless functions.
- Vérification de la présence de la function dans l’onglet "Functions" du dashboard Vercel.
- Test direct de `/api/getProfileVideos.js?id=<creatorId>` pour valider la réponse JSON.

### 4. Correction frontend
- Correction dans `src/pages/Profile.tsx` pour utiliser l’id du créateur (`profileData.creator?.id || profileData.id`) lors du fetch des vidéos.
- Vérification que l’API retourne bien la liste des vidéos pour un créateur existant.

## Résultat
- Le flow backend est 100% fonctionnel : routing, rewrite, Prisma, et API vidéos OK.
- Le frontend affiche correctement les vidéos du créateur sur son profil.
- Le debug a permis d’identifier et de corriger : conflits de routing, erreurs d’id, et problèmes de configuration Vercel.

---

**À retenir :**
- Toujours utiliser un handler plat pour les API dynamiques complexes sur Vercel (éviter les dossiers `[id]/...`).
- Vérifier la correspondance entre l’id utilisé côté frontend et la clé primaire attendue côté backend.
- Utiliser les logs Vercel et les tests directs d’API pour diagnostiquer rapidement les problèmes de routing.

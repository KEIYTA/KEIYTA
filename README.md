# KEIYTA

KEIYTA est un studio en construction pour imaginer et créer des vidéos avec l’intelligence artificielle.

Cette première version pose les bases de l’application : une page d’accueil en français, une direction visuelle sombre et violette, et une maquette de l’atelier.

## Démarrer en local

Il faut Node.js 20.9 ou une version plus récente.

```bash
npm install
npm run dev
```

Ouvrir ensuite [http://localhost:3000](http://localhost:3000).

## État actuel

L’atelier est une maquette d’interface. Aucun compte payant, service externe, clé API ou outil de génération vidéo n’est configuré.

## Storyboard IA

L’atelier envoie les demandes à la route serveur `/api/storyboard`. Si `OPENAI_API_KEY` est configurée, cette route utilise l’API Responses d’OpenAI avec une sortie JSON structurée. La clé reste côté serveur et ne doit jamais porter le préfixe `NEXT_PUBLIC_`. Sans clé, l’atelier affiche clairement le mode démo local.

Pour activer l’IA sur Vercel, ouvrez le projet KEIYTA dans Vercel, puis **Settings → Environment Variables**. Ajoutez `OPENAI_API_KEY` avec votre clé API OpenAI, sélectionnez les environnements voulus (Production et Preview), enregistrez et redéployez. Une clé API est nécessaire pour générer de vrais storyboards. Les appels à l’API OpenAI sont facturés séparément selon l’usage et le modèle; aucune demande API n’est envoyée tant que la clé n’est pas configurée.

Le prompt et le storyboard édité sont conservés dans le `localStorage` du navigateur.

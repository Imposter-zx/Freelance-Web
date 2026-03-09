# ZORD Freelance Platform

Une plateforme moderne et performante pour connecter les entreprises avec les meilleurs talents du digital.

## 🚀 Fonctionnalités

- **Architecture Scalable** : React avec Context API pour la gestion d'état globale.
- **Design Premium** : Interface responsive, moderne et fluide avec Framer Motion.
- **Dark Mode** : Support natif du thème sombre.
- **SEO Optimisé** : Gestion dynamique des métadonnées avec React Helmet.
- **Sécurité** : Routes protégées et authentification (persistée localement).
- **Performance** : Chargement rapide et code optimisé.

## 🛠 Tech Stack

- **Frontend** : React, Vite
- **Animations** : Framer Motion
- **Icons** : Lucide React
- **Routing** : React Router DOM 6
- **Styling** : Vanilla CSS avec Design Tokens modernes (variables CSS)

## 📦 Installation et Lancement Local

1. Clonez le projet :
   ```bash
   git clone [url-du-repo]
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

4. Ouvrez [http://localhost:5173](http://localhost:5173) dans votre navigateur.

## 📁 Structure du Projet

```
src/
├── components/
│   ├── common/      # Composants génériques (SEO, SEOMeta)
│   ├── layout/      # Structure de base (Header, Footer)
│   └── features/    # Composants spécifiques à des fonctionnalités
├── context/         # Gestion d'état (AuthContext)
├── pages/           # Pages de l'application
├── services/        # Mock data et logique métier
└── App.jsx          # Configuration des routes
```

## 🌐 Déploiement

Cette application est optimisée pour un déploiement sur **Vercel** ou **Netlify**. 
Un fichier `vercel.json` est inclus pour gérer les redirections SPA.

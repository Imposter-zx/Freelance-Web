# ZORD Freelance Platform

Une plateforme moderne et performante pour connecter les entreprises avec les meilleurs talents du digital.

## 🚀 Fonctionnalités

### Core
- **Architecture Scalable** : React 19 avec Context API pour la gestion d'état globale
- **Design Premium** : Interface responsive, moderne et fluide avec Framer Motion
- **Dark Mode** : Support natif du thème sombre
- **SEO Optimisé** : Gestion dynamique des métadonnées avec React Helmet
- **Sécurité** : Routes protégées et authentification (persistée localement)

### Communication
- **Messagerie en temps réel** : Chat avec prévisualisation intelligente des messages
- **Notifications** : Système de notifications avec badge de compteur
- **Statut en ligne** : Indicateur de disponibilité des utilisateurs

### Gestion de Projets
- **Publier un projet** : Formulaire multi-étapes (informations, budget, compétences)
- **Déposer des projets** : Les freelances peuvent soumettre des propositions
- **Suivi de projets** : Dashboard avec statistiques et progression

### Profils & Recherche
- **Profils détaillés** : Portfolio, avis, compétences, tarifs horaires
- **Recherche avancée** : Filtres par compétences, note, expérience, localisation
- **Cartes de freelances** : Affichage optimisé avec prévisualisation

### Paramètres
- **Profil utilisateur** : Photo, bio, localisation, compétences
- **Notifications** : Configuration des alertes email et push
- **Sécurité** : Authentification deux facteurs, changement de mot de passe
- **Facturation** : Méthodes de paiement, historique des factures

## 🛠 Tech Stack

| Catégorie | Technologies |
|-----------|-------------|
| **Frontend** | React 19, Vite 7, Tailwind CSS |
| **Animations** | Framer Motion |
| **Text Layout** | @chenglou/pretext |
| **Icons** | Lucide React |
| **Routing** | React Router DOM 7 |
| **SEO** | React Helmet Async |

## 📦 Installation

```bash
# Clonez le projet
git clone https://github.com/Imposter-zx/Freelance-Web.git

# Installez les dépendances
npm install

# Lancez le serveur de développement
npm run dev

# Ouvrez http://localhost:5173 dans votre navigateur
```

## 📁 Structure du Projet

```
src/
├── components/
│   ├── common/          # Composants génériques (SEO, LoadingSpinner)
│   ├── layout/          # Structure de base (Header, Footer)
│   ├── features/        # Composants spécifiques
│   └── pretext/         # Composants de texte avec pretext
│       ├── MessageBubble.jsx
│       ├── MessagePreview.jsx
│       ├── ProjectDescription.jsx
│       └── TextMeasure.jsx
├── context/             # Gestion d'état
│   ├── AuthContext.jsx
│   ├── MessageContext.jsx
│   ├── NotificationContext.jsx
│   └── LanguageContext.jsx
├── pages/               # Pages de l'application
│   ├── Home.jsx
│   ├── Dashboard.jsx
│   ├── Messages.jsx
│   ├── PostProject.jsx
│   ├── Profile.jsx
│   ├── ProjectDetails.jsx
│   ├── SearchFreelance.jsx
│   ├── Settings.jsx
│   ├── Login.jsx
│   └── CreateAccount.jsx
├── services/            # Mock data
├── utils/               # Utilitaires
│   └── animations.js
└── App.jsx              # Configuration des routes
```

## 🎨 Animations

Le projet utilise Framer Motion avec 50+ animations :
- **Entrée** : fadeInUp, fadeInDown, scaleIn, rotateIn
- **Scroll** : whileInView pour les éléments visibles
- **Hover** : scale, glow, lift
- **Continues** : float, pulse, shimmer, gradient
- **Staggered** : Animations séquentielles pour les listes

```javascript
import { fadeInUp, containerVariants, itemVariants } from './utils/animations';

<motion.div {...fadeInUp}>
  Contenu animé
</motion.div>
```

## 🔤 Pretext Integration

Le projet utilise [@chenglou/pretext](https://github.com/chenglou/pretext) pour :
- **Mesure de texte** sans reflow DOM
- **Layout multilingue** supportant toutes les langues
- **Performance** : ~0.09ms pour 500 mesures de texte

```javascript
import { prepare, layout } from '@chenglou/pretext';

const prepared = prepare('Bonjour le monde', '16px Inter');
const { height, lineCount } = layout(prepared, 300, 1.5);
```

## 🌐 Déploiement

Optimisé pour **Vercel** ou **Netlify** :
- Fichier `vercel.json` inclus pour les redirections SPA
- Build production avec `npm run build`

## 📊 Performance

- **Build size** : ~536 kB (gzipped: ~162 kB)
- **CSS** : ~44 kB (gzipped: ~8.5 kB)
- **Lazy loading** : Composants chargés à la demande
- **Optimisé** : GPU-accelerated animations

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## 📝 License

Ce projet est sous licence MIT.

---

**Développé avec ❤️ par ZORD Team**

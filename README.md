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
- **Messagerie en temps réel** : Chat avec prévisualisation intelligente des messages utilisant @chenglou/pretext pour un rendu optimal
- **Notifications** : Système de notifications avec badge de compteur
- **Statut en ligne** : Indicateur de disponibilité des utilisateurs

### Gestion de Projets
- **Publier un projet** : Formulaire multi-étapes (informations, budget, compétences, durée)
- **Déposer des projets** : Les freelances peuvent soumettre des propositions
- **Suivi de projets** : Dashboard avec statistiques, progression et analytics

### Profils & Recherche
- **Profils détaillés** : Portfolio, avis, compétences, tarifs horaires, photo de profil
- **Recherche avancée** : Filtres par compétences, note, expérience, localisation
- **Cartes de freelances** : Affichage optimisé avec photo de profil et prévisualisation intelligente
- **Profils Expansible** : Sections détaillables avec animation fluide

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
| **State Management** | React Context API |

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
│   ├── features/        # Composants spécifiques à des fonctionnalités
│   └── pretext/         # Composants de texte avec pretext pour un rendu optimisé
│       ├── MessageBubble.jsx
│       ├── MessagePreview.jsx
│       ├── ProjectDescription.jsx
│       └── TextMeasure.jsx
├── context/             # Gestion d'état global
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
├── services/            # Données mock et logique métier
│   └── mockData.js
├── utils/               # Utilitaires et animations
│   └── animations.js
├── designs_refresh.css  # Styles de design global et polish
└── App.jsx              # Configuration des routes
```

## 🎨 Animations

Le projet utilise Framer Motion avec 60+ animations :

- **Entrée** : fadeInUp, fadeInDown, scaleIn, rotateIn
- **Scroll** : whileInView pour les éléments visibles au défilement
- **Hover** : scale, glow, lift, pulse
- **Continues** : float, pulse, shimmer, gradient, marquee
- **Staggered** : Animations séquentielles pour les listes et grilles
- **Spéciales** : compteur, souligne animé, effet de surbrillance, transition de section

Exemple d'utilisation :
```javascript
import { fadeInUp, containerVariants, itemVariants } from './utils/animations';

<motion.div {...fadeInUp}>
  Contenu animé
</motion.div>
```

## 🔤 Pretext Integration

Le projet utilise [@chenglou/pretext](https://github.com/chenglou/pretext) pour une mesure et un layout de texte optimisés :

- **Mesure de texte** sans reflow DOM (performance ~0.09ms pour 500 mesures)
- **Layout multilingue** supportant toutes les langues incluant les emojis
- **Truncation intelligente** basée sur les lignes réelles plutôt que sur le nombre de caractères
- **Gestion du débordement** avec expansion/réduction fluide

Utilisation dans les composants :
```javascript
import { prepare, layout } from '@chenglou/pretext';

const prepared = prepare('Bonjour le monde', '16px Inter');
const { height, lineCount } = layout(prepared, 300, 1.5);
```

Composants prétext personnalisés :
- **MessageBubble** : rendu optimisé des bulles de chat
- **MessagePreview** : aperçu intelligent avec troncation basée sur les lignes
- **ProjectDescription** : description expansible avec animation fluide
- **TextMeasure** : hook React pour la mesure de texte

## 🌐 Déploiement

Optimisé pour **Vercel** ou **Netlify** :

- Fichier `vercel.json` inclus pour les redirections SPA
- Build production avec `npm run build`
- Variables d'environnement supportées pour la configuration

## 📊 Performance

- **Build size** : ~536 kB (gzipped: ~162 kB)
- **CSS** : ~44 kB (gzipped: ~8.5 kB)
- **JavaScript** : ~290 kB (gzipped: ~85 kB) après treeshaking
- **Lazy loading** : Composants chargés à la demande via routing
- **Optimisé** : GPU-accelerated animations avec requestAnimationFrame
- **Text Layout** : Prétext réduit significativement le coût de mesure de texte

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

Dernière mise à jour : Avril 2026
Version : 0.3.0
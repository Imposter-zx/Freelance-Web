export const services = [
    {
        id: 1,
        title: "Design Responsive",
        description: "Des interfaces modernes qui s'adaptent parfaitement à tous les terminaux : mobiles, tablettes et ordinateurs.",
        icon: "MonitorSmart"
    },
    {
        id: 2,
        title: "Développement Web",
        description: "Applications web performantes bâties sur les dernières technologies pour une rapidité et une sécurité optimales.",
        icon: "Code2"
    },
    {
        id: 3,
        title: "SEO & Marketing",
        description: "Stratégies de visibilité avancées pour propulser votre entreprise au sommet des résultats de recherche.",
        icon: "TrendingUp"
    }
];

export const freelancers = [
    {
        id: 1,
        name: "Jean Dupont",
        role: "Développeur Fullstack Senior",
        experience: "8 ans",
        skills: ["React", "Node.js", "AWS"],
        rating: 4.9,
        description: "Développeur passionné avec plus de 8 ans d'expérience dans la création d'applications web et mobiles performantes. Spécialiste en React, Node.js et solutions cloud AWS."
    },
    {
        id: 2,
        name: "Sophie Martin",
        role: "UX/UI Designer & Expert Webflow",
        experience: "5 ans",
        skills: ["Figma", "Webflow", "Prototyping"],
        rating: 5.0,
        description: "Designer créative spécialisée dans la conception d'interfaces utilisateur intuitives et esthétiques. Expertise en prototypage rapide et développement no-code."
    },
    {
        id: 3,
        name: "Ali Ben Youssef",
        role: "Expert SEO & Content Strategist",
        experience: "6 ans",
        skills: ["SEO", "Copywriting", "Analytics"],
        rating: 4.8,
        description: "Expert en stratégie de contenu et référencement naturel. J'aide les entreprises à augmenter leur visibilité en ligne et à générer du trafic qualifié."
    }
];

export const projects = [
    {
        id: 1,
        title: "Plateforme E-learning",
        description: "Nous recherchons un développeur React pour créer une plateforme d'apprentissage en ligne avec gestion de cours et quiz interactifs.",
        budgetMin: 2000,
        budgetMax: 5000,
        skills: ["React", "Node.js", "PostgreSQL"],
        createdAt: new Date().toISOString(),
        status: "open",
        client: "TechEdu"
    },
    {
        id: 2,
        title: "Refonte Branding",
        description: "Besoin d'un designer pour moderniser l'identité visuelle d'une startup dans le domaine de la GreenTech.",
        budgetMin: 800,
        budgetMax: 1500,
        skills: ["Figma", "Adobe Suite", "Branding"],
        createdAt: new Date().toISOString(),
        status: "open",
        client: "GreenCo"
    },
    {
        id: 3,
        title: "App Mobile Fitness",
        description: "Développement d'une application mobile de suivi de fitness avec intégration de montres connectées.",
        budgetMin: 3000,
        budgetMax: 7000,
        skills: ["React Native", "Firebase", "TypeScript"],
        createdAt: new Date().toISOString(),
        status: "open",
        client: "FitLife"
    }
];

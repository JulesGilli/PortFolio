export interface Project {
  id: number;
  slug?: string;
  title: string;
  description: string;
  fullDescription?: string;
  image: string;
  gallery?: string[];
  tags: string[];
  features?: string[];
  technologies?: string[];
  links?: {
    demo?: string;
    github?: string;
    youtube?: string;
    download?: string;
  };
}

const base = import.meta.env.BASE_URL;

export const allProjects: Project[] = [
  {
    id: 1,
    title: 'Medieval Skirmish',
    description: 'Jeu de puzzle tactique combinant tower defense et réflexion stratégique.',
    fullDescription: `Dans ce projet réalisé sur 6 mois à plein temps en équipe (programmation, GD, graphisme), j'ai pris le rôle de Game Designer principal. J'ai rédigé le GDD, conçu les règles et mécaniques, imaginé les niveaux, et participé au sound design et à la programmation. Le joueur doit utiliser des tourelles et des compétences, dont le redéploiement stratégique, pour repousser des vagues d’ennemis sur une carte composée de plusieurs chemins. Chaque niveau propose une nouvelle configuration à résoudre.`,
    image: `${base}images/MedievalSkirmish_01.png`,
    tags: ['Unity', 'C#', 'Tower Defense', 'Puzzle'],
    features: [
      "Système de redéploiement stratégique",
      "Carte modulaire avec 4 chemins possibles",
      "Tourelles & compétences uniques",
      "Gameplay basé sur la réflexion"
    ],
    technologies: ['Unity', 'C#', 'Git', 'ZBrush'],
    gallery: [
      `${base}images/MedievalSkirmish_01.png`,
      `${base}images/MedievalSkirmish_10.png`,
      `${base}images/MedievalSkirmish_03.png`,
      `${base}images/MedievalSkirmish_11.png`,
      `${base}images/MedievalSkirmish_12.png`
    ],
    links: {
      github: '',
      demo: '',
      youtube: '',
      download: '' 
    }
  },
  {
    id: 2,
    title: 'En Vers et Contre Tous',
    description: "Party game en 3D réalisé en 48h pour la Global Game Jam 2023 sur le thème 'écorce'.",
    fullDescription: `Jeu de plateforme compétitif en équipe de 4 (dev, graphiste, LD, support). J’ai conçu les mécaniques, rédigé un GDD, et programmé le jeu. Le joueur glisse en forêt en évitant les chutes et en optimisant son score. Il peut choisir entre plusieurs chemins lors de la descente. Jeu rapide et fun à jouer, conçu pour être rejoué plusieurs fois.`,
    image: `${base}images/Enversetcontretous_01.png`,
    tags: ['Unity', 'Game Jam', 'Party Game', 'C#'],
    features: [
      "Gameplay arcade rapide",
      "Multiples chemins",
      "Score à maximiser",
      "Développé en 48h"
    ],
    technologies: ['Unity', 'C#', 'GitHub'],
    gallery: [
      `${base}images/Enversetcontretous_01.png`,
      `${base}images/Enversetcontretous_02.png`,
      `${base}images/Enversetcontretous_03.png`,
      `${base}images/Enversetcontretous_04.png`,
      `${base}images/Enversetcontretous_05.png`
    ],
    links: {
      demo: '',
      github: '',
      youtube: '',
      download: '/downloads/EnVerEtContreTous.zip' 
    }
  },
  {
    id: 3,
    slug: 'cursum',
    title: 'Cursum',
    description: "Prototype solo de runner/FPS réalisé sur un mois en autonomie complète.",
    fullDescription: `Premier projet solo dans lequel j’ai tout géré : conception, GDD, design, programmation, intégration d’assets. Cursum est un jeu de course contre la montre à la première personne. Le joueur maîtrise un panel de mouvements : glissade, saut, wall-run... Le but est de terminer les parcours dans le temps imparti, avec un hub, un tutoriel, et un système de score.`,
    image: `${base}images/Cursum_01.png`,
    tags: ['Unity', 'C#', 'Runner', 'Solo Dev'],
    features: [
      "Wall run, glissade, saut",
      "Hub central avec scores",
      "Niveaux chronométrés",
      "Tutoriel interactif"
    ],
    technologies: ['Unity', 'C#'],
    gallery: [
      `${base}images/Cursum_01.png`,
      `${base}images/Cursum_02.png`,
      `${base}images/Cursum_03.png`,
      `${base}images/Cursum_04.png`,
      `${base}images/Cursum_05.png`
    ],
    links: {
      demo: 'https://jules-gilli.itch.io/cursum',
      github: '',
      youtube: '',
      download: '' 
    }
  },
  {
    id: 4,
    slug: 'keep-dancing',
    title: 'Keep Dancing to Live',
    description: "Jeu d'esquive rythmée réalisé en 48h pour la Global Game Jam 2024.",
    fullDescription: `Keep Dancing To Live est un jeu sur un fou du roi qui a besoin de danser. Le joueur doit tourner une planche de bois découpée en forme de héros. Si tu ne fais pas rire le roi... tu mourras.\n\nJeu réalisé dans le cadre de la GGJ 2024, en moins de 48h, avec Mariana Mancieri, Romain Pitot, Nicolas Saussol et Jules Gilli au développement, William Vasseur à la 3D, et l'ensemble de l'équipe à la conception.`,
    image: `${base}images/KeepDancing_01.png`,
    tags: ['Unity', 'Game Jam', 'Party Game', 'C#'],
    features: [
      "Gameplay original basé sur le rythme",
      "Rotation d’un personnage pour esquiver",
      "Ambiance délirante de cour royale"
    ],
    technologies: ['Unity', 'C#', 'Git', 'Blender'],
    gallery: [
      `${base}images/KeepDancing_01.png`,
      `${base}images/KeepDancing_02.png`,
      `${base}images/KeepDancing_03.png`,
      `${base}images/KeepDancing_04.png`
    ],
    links: {
      demo: 'https://jules-gilli.itch.io/keep-dancing-to-live',
      github: '',
      youtube: '',
      download: '' 
    }
  },
  {
    id: 5,
    slug: 'echoes',
    title: "Echoes of the Abyss",
    description: "Prototype d'action-aventure en arène fermée, axé sur le combat rapide et l'atmosphère oppressante.",
    fullDescription: `Echoes of the Abyss est un petit prototype d'action-aventure construit autour de combats rapides et d'une atmosphère tendue.\n\nLe joueur traverse une série d'arènes confinées où les ennemis ne laissent que peu de répit. Le rythme est nerveux, les salles sont restreintes, et la plupart des affrontements sont conçus pour mettre le joueur sous pression.\n\nLe gameplay se concentre sur le mouvement, le timing, et la survie jusqu'à la zone suivante. Pas de remplissage, pas de longues séquences narratives, pas de temps mort. Juste des combats brefs, des décisions rapides, et la sensation constante que l'endroit ne veut pas de toi.\n\nCette build est une version précoce destinée à montrer les idées centrales, l'ambiance, et la direction générale du gameplay.`,
    image: `${base}images/EchoesOfTheAbyss_00.png`,
    tags: ['Unity', 'Action', 'Prototype', 'Combat'],
    features: [
      "Combats rapides en arènes fermées",
      "Rythme nerveux sans temps mort",
      "Atmosphère oppressante",
      "Mouvement et timing au coeur du gameplay"
    ],
    technologies: ['Unity', 'C#'],
    gallery: [
      `${base}images/EchoesOfTheAbyss_01.png`,
      `${base}images/EchoesOfTheAbyss_02.png`,
      `${base}images/EchoesOfTheAbyss_03.png`,
      `${base}images/EchoesOfTheAbyss_04.png`,
      `${base}images/EchoesOfTheAbyss_05.png`,
      `${base}images/EchoesOfTheAbyss_Anim04.gif`,
      `${base}images/EchoesOfTheAbyss_Anim01.gif`,
      `${base}images/EchoesOfTheAbyss_Anim02.gif`,
      `${base}images/EchoesOfTheAbyss_Anim03.gif`
    ],
    links: {
      demo: 'https://jules-gilli.itch.io/echoes-of-the-abyss',
      github: 'https://github.com/JulesGilli/Echoes-of-the-abyss',
      youtube: '',
      download: ''
    }
  },
  {
    id: 6,
    title: "Speed Typo",
    description: "Jeu de dactylographie rapide avec plusieurs modes originaux et des effets dynamiques.",
    fullDescription: `Speed Typo est un jeu web de rapidité et de précision au clavier, développé en React et TypeScript. Pensé comme un serious game fun, il propose plusieurs modes de jeu originaux : mots classiques, inversés, remplacés par des chiffres, phrases infinies, ou encore un mode aveugle où l'on tape sans voir ce qu'on écrit.\n\nChaque session est ponctuée de sons, effets visuels et retours dynamiques. Le scoring en temps réel et les animations rendent l'expérience stimulante. Un système de succès est également intégré pour motiver l'exploration de tous les modes.\n\n👉 Le projet est actuellement en développement et continue d’évoluer avec de nouveaux modes et fonctionnalités à venir.`,
    image: `${base}images/SpeedTypo_Anim01.gif`,
    tags: ['React', 'Jeu Web', 'Solo Dev'],
    features: [
      "Plusieurs modes de jeu : normal, inversé, aveugle, chiffres, phrase infinie...",
      "Scoring dynamique avec effets visuels",
      "Système de succès en fonction des actions",
      "Interface fluide et responsive"
    ],
    technologies: ['React', 'TypeScript', 'Vite', 'TailwindCSS', 'Framer Motion'],
    gallery: [
      `${base}images/SpeedTypo_01.png`,
      `${base}images/SpeedTypo_02.png`,
      `${base}images/SpeedTypo_03.png`,
      `${base}images/SpeedTypo_04.png`,
      `${base}images/SpeedTypo_Anim01.gif`
    ],
    links: {
      demo: 'https://julesgilli.github.io/SpeedType/',
      github: 'https://github.com/JulesGilli/SpeedType',
      youtube: '',
      download: ''
    }
  },
  {
    id: 7,
    slug: 'whispers',
    title: "Whispers of the Tree",
    description: "Aventure narrative en boucle temporelle dans un village low-poly paisible, où chaque boucle révèle de nouveaux indices.",
    fullDescription: `Whispers of the Tree est une aventure narrative en vue à la troisième personne, plongée dans une mystérieuse boucle temporelle. 
Vous explorez un village fantasy low-poly, dialoguez avec ses habitants, découvrez des runes anciennes et utilisez les connaissances acquises d’une boucle à l’autre pour comprendre qui a détruit l’Arbre Sacré au centre du monde.
Une expérience calme et entièrement axée sur l’histoire, la découverte et l’investigation — sans combat, avec une fin unique.`,
    image: `${base}images/WhispersOfTheTree_01.png`,
    tags: ["Unity", "C#", "Narratif", "Boucle Temporelle", "Aventure"],
    features: [
      "Enquête en boucle temporelle avec connaissance persistante",
      "Dialogues à embranchements réagissant à vos découvertes",
      "Runes magiques aux effets uniques",
      "Exploration légère dans un village low-poly Synty",
      "Expérience narrative sans combat"
    ],
    technologies: ["Unity", "C#", "URP", "Input System"],
    gallery: [
      `${base}images/WhispersOfTheTree_01.png`,
      `${base}images/WhispersOfTheTree_02.png`,
      `${base}images/WhispersOfTheTree_03.png`,
      `${base}images/WhispersOfTheTree_04.png`,
      `${base}images/WhispersOfTheTree_05.png`,
      `${base}images/WhispersOfTheTree_06.png`,
      `${base}images/WhispersOfTheTree_07.png`,
      `${base}images/WhispersOfTheTree_08.png`
    ],
    links: {
      demo: "https://jules-gilli.itch.io/whispers-of-the-tree",
      github: "",
      youtube: "",
      download: ""
    }
  },
  {
    id: 8,
    slug: 'color-gap',
    title: "Color GAP",
    description: "Platformer minimaliste guidé par la couleur, le rythme et la perception. 🏆 Jury's Favorite — GGJ 2026.",
    fullDescription: `Color GAP est un platformer minimaliste guidé par la couleur, le rythme et la perception.\n\nVous explorez un monde immaculé construit autour d'un platforming précis et d'énigmes environnementales. Très tôt, un événement mystérieux fracture cet espace immaculé et scinde la réalité en trois couleurs primaires : jaune, rouge, bleu.\n\nÀ partir de ce moment, le monde existe en fragments superposés. Chaque saut décale votre perception, faisant cycler des masques de couleur qui ne révèlent que les parties de l'environnement correspondant à la couleur active.\n\nLes plateformes, chemins et obstacles sont toujours là — mais une seule couleur est visible à la fois. Pour progresser, il faut lire l'environnement, choisir le bon moment pour sauter, et s'engager dans le mouvement. Un saut mal calculé n'affecte pas seulement votre trajectoire — il change ce qui existe au moment de l'atterrissage.\n\nLa musique évolue avec vos actions, renforçant le lien entre mouvement, couleur et flow. Maîtriser le jeu, c'est apprendre quand sauter, pas seulement comment.\n\n🏆 Jury's Favorite Award — Global Game Jam 2026`,
    image: `${base}images/ColorGAP_01.png`,
    tags: ['Unity', 'Platformer', 'Game Jam', 'Puzzle'],
    features: [
      "Cycle de couleurs déclenché à chaque saut",
      "Plateformes visibles uniquement par couleur active",
      "Musique réactive au gameplay",
      "Récompensé Jury's Favorite à la GGJ 2026"
    ],
    technologies: ['Unity', 'C#'],
    gallery: [
      `${base}images/ColorGAP_01.png`
    ],
    links: {
      demo: "https://jules-gilli.itch.io/color-gap",
      github: "",
      youtube: "",
      download: ""
    }
  },
  {
    id: 9,
    slug: 'mirapyde',
    title: "Mirapyde",
    description: "Platformer 2D parkour avec manipulation du temps : crée un clone qui rejoue tes mouvements à l'envers.",
    fullDescription: `Mirapyde est un platformer 2D basé sur le parkour et la magie de la manipulation du temps.\n\nChaque salle est un puzzle fermé : une porte, un objectif, aucun remplissage. Tu avances uniquement en exécutant les bonnes actions au bon moment.\n\nLe principe central : figer le temps pour créer un clone qui rejoue tes mouvements… mais à l'envers. Ce double peut activer un bouton pendant que tu grimpes ailleurs, maintenir une plaque de pression, ou synchroniser une seconde action que tu ne pourrais jamais réaliser seul. Si tu te trompes, tu recommences immédiatement : pas de temps mort.\n\nLe jeu repose sur trois choses : mouvement propre, timing strict, et planification. Les pièges ne pardonnent rien, et chaque salle demande d'assembler les deux timelines pour obtenir la solution la plus propre possible.\n\nProgresse étage après étage dans la pyramide, et comprends vite que ce n'est pas ta dextérité seule qui t'en sortira, mais ta capacité à orchestrer deux versions de toi-même sans erreur.`,
    image: `${base}images/Mirapyde_01.png`,
    tags: ['Unity', 'Platformer 2D', 'Puzzle', 'Time Manipulation'],
    features: [
      "Clone temporel rejouant tes mouvements à l'envers",
      "Salles-puzzles à orchestrer en deux timelines",
      "Timing strict et planification",
      "Progression verticale dans une pyramide"
    ],
    technologies: ['Unity', 'C#'],
    gallery: [
      `${base}images/Mirapyde_01.png`
    ],
    links: {
      demo: "https://jules-gilli.itch.io/mirapyde",
      github: "",
      youtube: "",
      download: ""
    }
  }
];

/** Projects playable right now: itch.io builds and hosted web games. The site only shows these. */
export const onlineProjects: Project[] = allProjects.filter((p) => !!p.links?.demo);

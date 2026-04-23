export interface Social {
  name: string;
  url: string;
}

export interface Config {
  global: {
    underConstruction: {
      about: boolean;
      experience: boolean;
      community: boolean;
      informal: boolean;
      projects: boolean;
      contact: boolean;
    };
    underConstructionConfig: {
      heading: string;
      subtext: string;
      eta: string;
      statusLabel: string;
      ctaLabel: string;
    };
  };
  overlay: {
    section1: { title: string; subtitle: string };
    section2: { line1: string; line2: string };
    section3: { line1: string; line2: string };
  };
  about: {
    title: string;
    description: string;
    skills: string[];
    qualifications: { title: string; subtitle: string; year: string }[];
    socials: Social[];
  };
  experience: {
    sectionTitle: string;
    sectionSubtitle: string;
    timeline: any[];
    works: any[];
  };
  projects: {
    title: string;
    pageConfig: any;
    items: any[];
  };
  community: any[];
  informal: {
    title: string;
    creatorName: string;
    creatorId: string;
    youtubeUrl: string;
    instagramUrl: string;
    countriesCount: number;
    statesCount: number;
    description: string;
    video: { title: string; placeholder: string };
    heroImage: string;
    reels: Array<{ src: string; youtubeUrl: string; instaUrl: string; views: string; likes: string; title: string }>;
    photos: string[];
    [key: string]: any;
  };
  sequences: {
    hero: SequenceConfig;
    experience: SequenceConfig;
    community: SequenceConfig;
    informal: SequenceConfig;
  };
  footer: {
    text: string;
  };
}

export interface SequenceConfig {
  baseUrl: string;
  frameCount: number;
  framePattern: string;
}

// Skeleton used when config.json is missing or during initial sync
export const SKELETON_CONFIG: Config = {
  global: {
    underConstruction: {
      about: false,
      experience: false,
      community: false,
      informal: false,
      projects: true,
      contact: false
    },
    underConstructionConfig: {
      heading: "We're currently building this page",
      subtext: "Awesome things take time. Check back soon for updates.",
      eta: "ETA: SOON",
      statusLabel: "IN PROGRESS",
      ctaLabel: "Return Home"
    }
  },
  overlay: {
    section1: { title: "", subtitle: "" },
    section2: { line1: "", line2: "" },
    section3: { line1: "", line2: "" }
  },
  about: {
    title: "",
    description: "",
    skills: [],
    qualifications: [],
    socials: []
  },
  experience: {
    sectionTitle: "",
    sectionSubtitle: "",
    timeline: [],
    works: []
  },
  projects: {
    title: "Projects",
    pageConfig: {},
    items: []
  },
  community: [],
  informal: {
    title: "",
    creatorName: "",
    creatorId: "",
    youtubeUrl: "",
    instagramUrl: "",
    countriesCount: 0,
    statesCount: 0,
    description: "",
    video: {
      title: "",
      placeholder: ""
    },
    heroImage: "",
    reels: [],
    photos: []
  },
  sequences: {
    hero: { baseUrl: '', frameCount: 0, framePattern: '' },
    experience: { baseUrl: '', frameCount: 0, framePattern: '' },
    community: { baseUrl: '', frameCount: 0, framePattern: '' },
    informal: { baseUrl: '', frameCount: 0, framePattern: '' },
  },
  footer: {
    text: ""
  }
};

/**
 * Robust config accessor.
 * Now safe for both client and server (on client it returns the skeleton).
 * To get real data on the server, use getServerConfig from @/lib/server/config
 */
export function getConfig(): Config {
  return SKELETON_CONFIG as Config;
}

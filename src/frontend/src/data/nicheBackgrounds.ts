export interface NicheSectionImage {
  sectionName: string;
  imageUrl: string;
  overlayOpacity: number;
}

export interface NicheBackground {
  heroImage: string;
  heroImageMobileFocus: string;
  sectionImages: NicheSectionImage[];
  accentColor: string;
}

export const nicheBackgrounds: Record<string, NicheBackground> = {
  roofing: {
    heroImage:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80",
    heroImageMobileFocus: "center 40%",
    sectionImages: [
      {
        sectionName: "pain",
        imageUrl:
          "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80",
        overlayOpacity: 0.65,
      },
      {
        sectionName: "app-preview",
        imageUrl:
          "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80",
        overlayOpacity: 0.87,
      },
    ],
    accentColor: "#f97316",
  },
  plumbing: {
    heroImage:
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=1920&q=80",
    heroImageMobileFocus: "center 30%",
    sectionImages: [
      {
        sectionName: "pain",
        imageUrl:
          "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1200&q=70",
        overlayOpacity: 0.82,
      },
      {
        sectionName: "app-preview",
        imageUrl:
          "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=70",
        overlayOpacity: 0.87,
      },
    ],
    accentColor: "#3b82f6",
  },
  hvac: {
    heroImage:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1920&q=80",
    heroImageMobileFocus: "center 35%",
    sectionImages: [
      {
        sectionName: "pain",
        imageUrl:
          "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&q=70",
        overlayOpacity: 0.82,
      },
      {
        sectionName: "app-preview",
        imageUrl:
          "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1200&q=70",
        overlayOpacity: 0.87,
      },
    ],
    accentColor: "#06b6d4",
  },
  "med-spa": {
    heroImage:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1920&q=80",
    heroImageMobileFocus: "center 25%",
    sectionImages: [
      {
        sectionName: "pain",
        imageUrl:
          "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=1200&q=70",
        overlayOpacity: 0.82,
      },
      {
        sectionName: "app-preview",
        imageUrl:
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1200&q=70",
        overlayOpacity: 0.87,
      },
    ],
    accentColor: "#ec4899",
  },
  "carpet-cleaning": {
    heroImage:
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=1920&q=80",
    heroImageMobileFocus: "center 50%",
    sectionImages: [
      {
        sectionName: "pain",
        imageUrl:
          "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=70",
        overlayOpacity: 0.82,
      },
      {
        sectionName: "app-preview",
        imageUrl:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=70",
        overlayOpacity: 0.87,
      },
    ],
    accentColor: "#10b981",
  },
  "real-estate": {
    heroImage:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80",
    heroImageMobileFocus: "center 40%",
    sectionImages: [
      {
        sectionName: "pain",
        imageUrl:
          "https://images.unsplash.com/photo-1582407947304-fd86f28f4b5a?w=1200&q=70",
        overlayOpacity: 0.83,
      },
      {
        sectionName: "app-preview",
        imageUrl:
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=70",
        overlayOpacity: 0.88,
      },
    ],
    accentColor: "#f59e0b",
  },
  mortgage: {
    heroImage:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1920&q=80",
    heroImageMobileFocus: "center 35%",
    sectionImages: [
      {
        sectionName: "pain",
        imageUrl:
          "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=70",
        overlayOpacity: 0.84,
      },
      {
        sectionName: "app-preview",
        imageUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=70",
        overlayOpacity: 0.87,
      },
    ],
    accentColor: "#10b981",
  },
  chiropractor: {
    heroImage:
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1920&q=80",
    heroImageMobileFocus: "center 45%",
    sectionImages: [
      {
        sectionName: "pain",
        imageUrl:
          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&q=70",
        overlayOpacity: 0.82,
      },
      {
        sectionName: "app-preview",
        imageUrl:
          "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=70",
        overlayOpacity: 0.86,
      },
    ],
    accentColor: "#06b6d4",
  },
  dental: {
    heroImage:
      "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1920&q=80",
    heroImageMobileFocus: "center 35%",
    sectionImages: [
      {
        sectionName: "pain",
        imageUrl:
          "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=1200&q=70",
        overlayOpacity: 0.83,
      },
      {
        sectionName: "app-preview",
        imageUrl:
          "https://images.unsplash.com/photo-1588776814546-daab30f310ce?w=1200&q=70",
        overlayOpacity: 0.87,
      },
    ],
    accentColor: "#6366f1",
  },
  restoration: {
    heroImage:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80",
    heroImageMobileFocus: "center 40%",
    sectionImages: [
      {
        sectionName: "pain",
        imageUrl:
          "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1200&q=70",
        overlayOpacity: 0.82,
      },
      {
        sectionName: "app-preview",
        imageUrl:
          "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=70",
        overlayOpacity: 0.87,
      },
    ],
    accentColor: "#6366f1",
  },
};

export function getNicheBackground(nicheKey: string): NicheBackground | null {
  return nicheBackgrounds[nicheKey] ?? null;
}

export interface CreditLink {
  name: string;
  url: string;
  description: string;
}

export const getCreditLinks = (lang: "en" | "es"): CreditLink[] => {
  if (lang === "es") {
    return [
      {
        name: "Lanyard",
        url: "https://discord.gg/UrXF2cfJ7F",
        description: "La API de presencia de Discord en tiempo real que impulsa todos los datos de los widgets.",
      },
      {
        name: "Fontshare",
        url: "https://www.fontshare.com",
        description: "Fuentes gratuitas de alta calidad servidas a través de una API de CDN limpia.",
      },
      {
        name: "dcdn.dstn.to",
        url: "https://dcdn.dstn.to",
        description: "Una API de CDN de Discord utilizada para obtener banners",
      },
    ];
  }

  return [
    {
      name: "Lanyard",
      url: "https://discord.gg/UrXF2cfJ7F",
      description: "Real-time Discord presence API powering all widget data.",
    },
    {
      name: "Fontshare",
      url: "https://www.fontshare.com",
      description: "Free, high-quality fonts served via a clean CDN API.",
    },
    {
      name: "dcdn.dstn.to",
      url: "https://dcdn.dstn.to",
      description: "A Discord CDN API used for fetching banners",
    },
  ];  
};

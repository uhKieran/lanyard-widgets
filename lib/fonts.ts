export const fontshareFonts = [
  { slug: "general-sans", name: "General Sans" },
  { slug: "switzer", name: "Switzer" },
  { slug: "satoshi", name: "Satoshi" },
  { slug: "cabinet-grotesk", name: "Cabinet Grotesk" },
  { slug: "clash-grotesk", name: "Clash Grotesk" },
  { slug: "clash-display", name: "Clash Display" },
  { slug: "boska", name: "Boska" },
  { slug: "gambetta", name: "Gambetta" },
  { slug: "sentient", name: "Sentient" },
  { slug: "synonym", name: "Synonym" },
  { slug: "comico", name: "Comico" },
  { slug: "technor", name: "Technor" },
  { slug: "gambarino", name: "Gambarino" },
  { slug: "rowan", name: "Rowan" },
  { slug: "tabular", name: "Tabular" },
  { slug: "kihim", name: "Kihim" },
  { slug: "chillax", name: "Chillax" },
  { slug: "zodiak", name: "Zodiak" },
  { slug: "tanker", name: "Tanker" },
  { slug: "authors", name: "Authors" },
  { slug: "array", name: "Array" },
  { slug: "pilcrow-rounded", name: "Pilcrow Rounded" },

];

export function fontshareUrl(slug: string) {
  return `https://api.fontshare.com/v2/css?f[]=${slug}@700,500,400&display=swap`;
}

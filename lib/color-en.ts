import type { ColorProfile, SeasonKey } from "@/lib/color-analysis";

export type EnglishSeason = {
  name: string;
  note: string;
  makeup: { lip: string; blush: string; eye: string; brow: string };
};

export const ENGLISH_SEASONS: Record<SeasonKey, EnglishSeason> = {
  "light-spring": { name: "Light Spring", note: "Light · warm · clear", makeup: { lip: "peach coral", blush: "apricot pink", eye: "light caramel", brow: "warm brown" } },
  "true-spring": { name: "True Spring", note: "Fresh · bright · warm", makeup: { lip: "tomato red", blush: "warm coral", eye: "golden brown", brow: "natural brown" } },
  "bright-spring": { name: "Bright Spring", note: "Vivid · clear · energetic", makeup: { lip: "bright coral red", blush: "fresh peach", eye: "luminous gold brown", brow: "deep warm brown" } },
  "light-summer": { name: "Light Summer", note: "Airy · cool · translucent", makeup: { lip: "light rose pink", blush: "cool pink", eye: "soft rosy taupe", brow: "light ash brown" } },
  "true-summer": { name: "True Summer", note: "Cool · soft · elegant", makeup: { lip: "dusty rose", blush: "smoky pink", eye: "greyed mauve brown", brow: "cool ash brown" } },
  "soft-summer": { name: "Soft Summer", note: "Muted · low-chroma · cool", makeup: { lip: "muted rose", blush: "soft mauve", eye: "grey brown", brow: "soft ash brown" } },
  "soft-autumn": { name: "Soft Autumn", note: "Gentle · muted · low contrast", makeup: { lip: "cinnamon rose", blush: "nude apricot", eye: "olive brown", brow: "soft warm brown" } },
  "true-autumn": { name: "True Autumn", note: "Rich · warm · natural", makeup: { lip: "brick red", blush: "terracotta", eye: "copper brown", brow: "deep warm brown" } },
  "deep-autumn": { name: "Deep Autumn", note: "Deep · rich · warm", makeup: { lip: "deep maple red", blush: "warm russet", eye: "deep olive", brow: "dark brown" } },
  "bright-winter": { name: "Bright Winter", note: "Crisp · vivid · high contrast", makeup: { lip: "true red or berry", blush: "bright cool pink", eye: "cool charcoal", brow: "deep ash brown" } },
  "true-winter": { name: "True Winter", note: "Cool · pure · striking", makeup: { lip: "blue-based red", blush: "cool rose", eye: "charcoal grey", brow: "cool deep brown" } },
  "deep-winter": { name: "Deep Winter", note: "Deep · cool · dramatic", makeup: { lip: "deep berry", blush: "wine rose", eye: "black-brown or navy", brow: "cool black-brown" } },
};

export type EnglishAdvice = {
  secondary: string;
  foundation: string;
  hair: string;
  hairAvoid: string;
  lens: string;
  glasses: string;
  jewelry: string;
  manicure: string;
  outfitSame: string;
  outfitNeighbor: string;
  accent: string;
  ratio: string;
  fabrics: string;
  pattern: string;
  white: string;
  black: string;
  stylingRule: string;
};

const SECONDARY: Record<SeasonKey, string> = {
  "light-spring": "Light Summer", "true-spring": "Bright Spring", "bright-spring": "Bright Winter",
  "light-summer": "Light Spring", "true-summer": "Soft Summer", "soft-summer": "Soft Autumn",
  "soft-autumn": "Soft Summer", "true-autumn": "Deep Autumn", "deep-autumn": "Deep Winter",
  "bright-winter": "Bright Spring", "true-winter": "Deep Winter", "deep-winter": "Deep Autumn",
};

const FAMILY: Record<"spring" | "summer" | "autumn" | "winter", Omit<EnglishAdvice, "secondary">> = {
  spring: {
    foundation: "Ivory, light warm beige, or a bright yellow-based shade", hair: "Honey brown, caramel brown, or warm tea brown", hairAvoid: "Blue-black, grey-purple black, and very cool ash tones", lens: "Light tea brown, amber, or olive brown", glasses: "Champagne gold, tortoiseshell, or clear warm-tea frames", jewelry: "Yellow gold, champagne gold, or warm rose gold", manicure: "Peach, coral, butter yellow, or warm nude",
    outfitSame: "Cream + coral + light caramel", outfitNeighbor: "Fresh green + sky blue + cream", accent: "Bright tomato red or clear blue-green", ratio: "60% bright neutral + 30% main color + 10% vivid accent", fabrics: "Lightweight cotton, silk, and fine knits with a soft sheen", pattern: "Crisp small florals, dots, or lively stripes", white: "Cream or ivory", black: "Swap pure black for deep brown or warm navy", stylingRule: "Keep the palette clear and luminous; use deep shades mainly for definition.",
  },
  summer: {
    foundation: "Pink ivory, neutral pink, or a cool-toned base", hair: "Rose brown, misty tea brown, or soft ash brown", hairAvoid: "Orange brown, copper red, and yellowed golden brown", lens: "Grey brown, misty blue-grey, or soft violet-grey", glasses: "Matte silver, clear grey, or soft rose frames", jewelry: "Soft silver, white gold, or muted rose gold", manicure: "Mauve pink, grey-purple, berry nude, or misty blue",
    outfitSame: "Dusty pink + misty blue + soft grey", outfitNeighbor: "Lavender + sage + cloud white", accent: "Berry red or muted peacock blue", ratio: "60% soft neutral + 30% cool muted color + 10% deep accent", fabrics: "Fine matte textures, chiffon, soft knits, and lightweight wool", pattern: "Low-contrast watercolor florals or fine stripes", white: "Soft white or pearl grey-white", black: "Swap pure black for charcoal or cool navy", stylingRule: "Keep a soft haze between colors and avoid stark black-and-white breaks.",
  },
  autumn: {
    foundation: "Warm ivory, yellow-based natural, or olive-toned foundation", hair: "Deep chestnut, copper brown, or chocolate brown", hairAvoid: "Ash blonde, cool purple-black, and pale grey-gold", lens: "Amber brown, olive brown, or deep tea-grey", glasses: "Antique gold, matte bronze, or deep tortoiseshell", jewelry: "Antique gold, bronze, or copper", manicure: "Caramel, brick red, khaki, or deep olive",
    outfitSame: "Caramel + khaki + espresso", outfitNeighbor: "Brick red + caramel + mustard", accent: "Turquoise or deep orange-red", ratio: "60% khaki/camel base + 30% olive or caramel + 10% brick accent", fabrics: "Corduroy, suede, chunky knits, and linen", pattern: "Earth-tone checks, artisanal motifs, or low-value prints", white: "Oatmeal or warm off-white", black: "Swap pure black for chocolate or forest green", stylingRule: "Let substantial textures support rich color; choose matte or antiqued metals.",
  },
  winter: {
    foundation: "Cool porcelain, neutral pink, or clear cool beige", hair: "Natural black, black tea, cool deep brown, or wine-black", hairAvoid: "Yellow blonde, orange brown, and muted khaki", lens: "Natural black, cool grey, or deep blue-grey", glasses: "Polished silver, black, or cool clear frames", jewelry: "Polished silver, white gold, or platinum", manicure: "True red, berry purple, black cherry, or cool grey",
    outfitSame: "Black + cool white + jewel blue", outfitNeighbor: "Berry + violet + deep navy", accent: "High-purity true red or electric blue", ratio: "60% black/white/deep cool base + 30% jewel tone + 10% bright accent", fabrics: "Crisp, lustrous, or sharply finished leather, satin, and fine wool", pattern: "High-contrast geometrics, bold stripes, or clean color blocks", white: "Pure white or ice white", black: "Pure black is an ideal base", stylingRule: "Keep clear light-dark boundaries and use one saturated color as the focal point.",
  },
};

function familyOf(season: SeasonKey) {
  if (season.includes("spring")) return "spring";
  if (season.includes("summer")) return "summer";
  if (season.includes("autumn")) return "autumn";
  return "winter";
}

export function getEnglishAdvice(season: SeasonKey, profile: ColorProfile): EnglishAdvice {
  const base = FAMILY[familyOf(season)];
  const subtype = season.startsWith("light") ? " Keep the overall look light, with no shade deeper than your hair." : season.startsWith("deep") ? " Build on deep shades and lift them with medium-to-high chroma accents." : season.startsWith("soft") ? " Blend neighboring muted colors and avoid fluorescent brightness." : season.startsWith("bright") ? " Crisp color contrast works well; avoid muddy, greyed combinations." : profile.contrast === "高" ? " Preserve clear light-dark contrast for definition." : " Aim for medium contrast and let color do more work than black and white.";
  return { ...base, secondary: SECONDARY[season], stylingRule: base.stylingRule + subtype };
}

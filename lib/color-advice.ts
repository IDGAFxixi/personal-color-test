import type { ColorProfile, SeasonKey } from "@/lib/color-analysis";

type Family = "spring" | "summer" | "autumn" | "winter";

export type ExtendedAdvice = {
  secondary: string;
  foundation: string;
  hair: string;
  hairAvoid: string;
  lens: string;
  glasses: string;
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
  "light-spring": "浅夏型", "true-spring": "亮春型", "bright-spring": "亮冬型",
  "light-summer": "浅春型", "true-summer": "柔夏型", "soft-summer": "柔秋型",
  "soft-autumn": "柔夏型", "true-autumn": "深秋型", "deep-autumn": "深冬型",
  "bright-winter": "亮春型", "true-winter": "深冬型", "deep-winter": "深秋型",
};

const FAMILY: Record<Family, Omit<ExtendedAdvice, "secondary">> = {
  spring: {
    foundation: "象牙白、浅暖米或黄调偏亮粉底", hair: "蜂蜜棕、焦糖棕、暖茶棕", hairAvoid: "蓝黑、灰紫黑与过度冷灰", lens: "浅茶棕、琥珀棕、橄榄棕", glasses: "香槟金、玳瑁或透明暖茶框", manicure: "蜜桃、珊瑚、奶油黄或暖裸色",
    outfitSame: "杏色 + 珊瑚 + 浅焦糖", outfitNeighbor: "嫩绿 + 天空蓝 + 奶油白", accent: "亮番茄红或清透蓝绿", ratio: "60% 明亮中性色 + 30% 主色 + 10% 高彩点缀", fabrics: "轻盈且有微光的棉、真丝、细针织", pattern: "清晰的小花、圆点或轻快条纹", white: "奶油白、象牙白", black: "以深咖、暖海军蓝替代纯黑", stylingRule: "保持颜色清透，深色只做轮廓，不要大面积压住面部。",
  },
  summer: {
    foundation: "粉调象牙白、中性偏粉或冷调粉底", hair: "玫瑰棕、雾感茶棕、柔灰棕", hairAvoid: "橘棕、铜红与发黄的金棕", lens: "灰棕、雾蓝灰、柔紫灰", glasses: "哑光银、透明灰或柔玫瑰框", manicure: "藕粉、灰紫、莓果豆沙或雾蓝",
    outfitSame: "灰粉 + 雾蓝 + 柔灰", outfitNeighbor: "薰衣草紫 + 鼠尾草绿 + 云白", accent: "莓果红或雾调孔雀蓝", ratio: "60% 柔和浅中性色 + 30% 冷柔主色 + 10% 深色点缀", fabrics: "细腻哑光、雪纺、柔软针织与轻羊毛", pattern: "低对比水彩花纹或细条纹", white: "柔白、珍珠灰白", black: "以炭灰、冷海军蓝替代纯黑", stylingRule: "让色彩之间有一层雾感，减少强烈黑白切割。",
  },
  autumn: {
    foundation: "暖象牙、黄调自然色或橄榄调粉底", hair: "深栗棕、铜棕、巧克力棕", hairAvoid: "亚麻灰、冷紫黑与漂浅灰金", lens: "琥珀棕、橄榄棕、深茶灰", glasses: "古铜金、哑光青铜或深玳瑁", manicure: "焦糖、砖红、卡其或深橄榄",
    outfitSame: "焦糖棕 + 卡其 + 深咖", outfitNeighbor: "砖红 + 焦糖 + 芥末黄", accent: "松石绿或深橙红", ratio: "60% 卡其/驼色打底 + 30% 橄榄或焦糖 + 10% 砖红点缀", fabrics: "有质感的灯芯绒、麂皮、粗针织与亚麻", pattern: "大地色格纹、民族纹样或低明度印花", white: "燕麦白、米白", black: "以巧克力棕、墨绿替代纯黑", stylingRule: "用有重量的材质承接浓郁色彩，金属选择哑光和做旧质感。",
  },
  winter: {
    foundation: "冷调瓷白、中性偏粉或清透冷米色", hair: "自然黑、黑茶、冷深棕或酒红黑", hairAvoid: "发黄浅金、橘棕与灰蒙卡其", lens: "自然黑、冷灰、深蓝灰", glasses: "亮银、黑色或冷透明框", manicure: "正红、莓紫、黑樱桃或冷灰",
    outfitSame: "纯黑 + 冷白 + 宝石蓝", outfitNeighbor: "莓红 + 紫罗兰 + 深海军蓝", accent: "高纯度正红或电光蓝", ratio: "60% 黑白/深冷色 + 30% 宝石色 + 10% 高亮点缀", fabrics: "挺括、有光泽或边缘清晰的皮革、缎面与精纺羊毛", pattern: "高对比几何、宽条纹或利落色块", white: "纯白、冰白", black: "纯黑是理想基础色", stylingRule: "保留清晰明暗边界，用一个高纯度颜色建立视觉焦点。",
  },
};

const familyOf = (season: SeasonKey): Family => season.includes("spring") ? "spring" : season.includes("summer") ? "summer" : season.includes("autumn") ? "autumn" : "winter";

export function getExtendedAdvice(season: SeasonKey, profile: ColorProfile): ExtendedAdvice {
  const base = FAMILY[familyOf(season)];
  const subtype = season.startsWith("light") ? "整体保持轻浅，最深色不超过发色。" : season.startsWith("deep") ? "适合深色打底，用中高彩色提亮。" : season.startsWith("soft") ? "相邻颜色宜低对比过渡，避免荧光感。" : season.startsWith("bright") ? "适合清晰撞色，避免灰蒙和浑浊。" : profile.contrast === "高" ? "保留明暗对比，轮廓会更有精神。" : "以中等对比为主，色彩比黑白更重要。";
  return { ...base, secondary: SECONDARY[season], stylingRule: `${base.stylingRule}${subtype}` };
}

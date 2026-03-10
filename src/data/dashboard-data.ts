export type MenuItem = {
  id: string;
  name: string;
  icon: string;
  category: string;
};

export type ComboPattern = {
  id: string;
  items: string[];
  support: number;
  confidence: number;
  lift?: number;
  estimatedSalesIncrease?: number;
};

export type AssociationRule = {
  antecedent: string;
  consequent: string;
  support: number;
  confidence: number;
  lift: number;
};

export type Promotion = {
  id: string;
  description: string;
  support: number;
  confidence: number;
  estimatedIncrease: number;
};

export type NetworkNode = {
  id: string;
  label: string;
  x: number;
  y: number;
};

export type NetworkEdge = {
  source: string;
  target: string;
  weight: number;
};

export const menuItems: MenuItem[] = [
  { id: "chickenjoy", name: "Chickenjoy", icon: "🍗", category: "Chicken" },
  { id: "burger-steak", name: "Burger Steak", icon: "🍔", category: "Burger" },
  { id: "jolly-spaghetti", name: "Jolly Spaghetti", icon: "🍝", category: "Pasta" },
  { id: "fries", name: "Jolly Crispy Fries", icon: "🍟", category: "Sides" },
  { id: "coke", name: "Coke", icon: "🥤", category: "Drinks" },
  { id: "peach-mango-pie", name: "Peach Mango Pie", icon: "🥧", category: "Desserts" },
  { id: "palabok", name: "Jolly Palabok", icon: "🍜", category: "Pasta" },
  { id: "sundae", name: "Chocolate Sundae", icon: "🍨", category: "Desserts" },
  { id: "rice", name: "Rice", icon: "🍚", category: "Sides" },
  { id: "iced-tea", name: "Iced Tea", icon: "🧊", category: "Drinks" },
];

export const trendingCombos: ComboPattern[] = [
  { id: "tc1", items: ["Chickenjoy", "Rice", "Coke"], support: 42.5, confidence: 87.3 },
  { id: "tc2", items: ["Burger Steak", "Fries"], support: 35.2, confidence: 78.6 },
  { id: "tc3", items: ["Jolly Spaghetti", "Coke"], support: 31.8, confidence: 72.1 },
  { id: "tc4", items: ["Chickenjoy", "Peach Mango Pie"], support: 28.4, confidence: 68.9 },
  { id: "tc5", items: ["Jolly Palabok", "Iced Tea"], support: 22.1, confidence: 61.4 },
];

export const aiRecommendedCombo: ComboPattern = {
  id: "ai1",
  items: ["Chickenjoy", "Jolly Spaghetti", "Coke"],
  support: 38.7,
  confidence: 91.2,
  lift: 2.45,
  estimatedSalesIncrease: 23,
};

export const promotions: Promotion[] = [
  { id: "p1", description: "Buy Chickenjoy + Fries → Get Coke Discount", support: 34.2, confidence: 82.5, estimatedIncrease: 18 },
  { id: "p2", description: "Buy Jolly Spaghetti → Add Peach Mango Pie at ₱15 off", support: 27.8, confidence: 74.3, estimatedIncrease: 14 },
  { id: "p3", description: "Buy 2pc Chickenjoy → Free Rice Upgrade", support: 41.1, confidence: 88.9, estimatedIncrease: 22 },
];

export const upsellMap: Record<string, { name: string; icon: string; confidence: number }[]> = {
  chickenjoy: [
    { name: "Jolly Spaghetti", icon: "🍝", confidence: 91 },
    { name: "Jolly Crispy Fries", icon: "🍟", confidence: 85 },
    { name: "Coke", icon: "🥤", confidence: 82 },
    { name: "Peach Mango Pie", icon: "🥧", confidence: 68 },
  ],
  "burger-steak": [
    { name: "Jolly Crispy Fries", icon: "🍟", confidence: 88 },
    { name: "Coke", icon: "🥤", confidence: 79 },
    { name: "Chocolate Sundae", icon: "🍨", confidence: 62 },
  ],
  "jolly-spaghetti": [
    { name: "Coke", icon: "🥤", confidence: 84 },
    { name: "Chickenjoy", icon: "🍗", confidence: 77 },
    { name: "Peach Mango Pie", icon: "🥧", confidence: 59 },
  ],
  fries: [
    { name: "Burger Steak", icon: "🍔", confidence: 81 },
    { name: "Coke", icon: "🥤", confidence: 76 },
  ],
  coke: [
    { name: "Chickenjoy", icon: "🍗", confidence: 86 },
    { name: "Jolly Crispy Fries", icon: "🍟", confidence: 71 },
  ],
};

export const networkNodes: NetworkNode[] = [
  { id: "chickenjoy", label: "🍗 Chickenjoy", x: 300, y: 120 },
  { id: "rice", label: "🍚 Rice", x: 500, y: 60 },
  { id: "coke", label: "🥤 Coke", x: 500, y: 200 },
  { id: "fries", label: "🍟 Fries", x: 150, y: 250 },
  { id: "spaghetti", label: "🍝 Spaghetti", x: 300, y: 300 },
  { id: "burger", label: "🍔 Burger Steak", x: 100, y: 100 },
  { id: "pie", label: "🥧 Pie", x: 500, y: 330 },
  { id: "sundae", label: "🍨 Sundae", x: 150, y: 370 },
];

export const networkEdges: NetworkEdge[] = [
  { source: "chickenjoy", target: "rice", weight: 5 },
  { source: "chickenjoy", target: "coke", weight: 4 },
  { source: "chickenjoy", target: "fries", weight: 3 },
  { source: "chickenjoy", target: "spaghetti", weight: 3 },
  { source: "spaghetti", target: "coke", weight: 4 },
  { source: "burger", target: "fries", weight: 4 },
  { source: "burger", target: "coke", weight: 2 },
  { source: "chickenjoy", target: "pie", weight: 2 },
  { source: "spaghetti", target: "pie", weight: 1 },
  { source: "sundae", target: "burger", weight: 1 },
];

export const topCombinations = [
  { name: "Chickenjoy + Rice + Coke", support: 42.5 },
  { name: "Burger Steak + Fries", support: 35.2 },
  { name: "Spaghetti + Coke", support: 31.8 },
  { name: "Chickenjoy + Pie", support: 28.4 },
  { name: "Palabok + Iced Tea", support: 22.1 },
  { name: "Chickenjoy + Fries", support: 19.8 },
  { name: "Burger + Coke", support: 17.3 },
];

export const associationRules: AssociationRule[] = [
  { antecedent: "Chickenjoy", consequent: "Rice", support: 42.5, confidence: 87.3, lift: 2.1 },
  { antecedent: "Chickenjoy", consequent: "Coke", support: 38.1, confidence: 82.4, lift: 1.9 },
  { antecedent: "Burger Steak", consequent: "Fries", support: 35.2, confidence: 78.6, lift: 2.3 },
  { antecedent: "Jolly Spaghetti", consequent: "Coke", support: 31.8, confidence: 72.1, lift: 1.7 },
  { antecedent: "Chickenjoy", consequent: "Peach Mango Pie", support: 28.4, confidence: 68.9, lift: 1.5 },
  { antecedent: "Chickenjoy, Fries", consequent: "Coke", support: 25.6, confidence: 91.2, lift: 2.8 },
  { antecedent: "Jolly Palabok", consequent: "Iced Tea", support: 22.1, confidence: 61.4, lift: 1.4 },
  { antecedent: "Burger Steak", consequent: "Coke", support: 19.5, confidence: 58.7, lift: 1.3 },
];

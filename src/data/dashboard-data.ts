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
  leverage: number;
  conviction: number;
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

export const menuItems: MenuItem[] = [];

export const trendingCombos: ComboPattern[] = [];

export const aiRecommendedCombo: ComboPattern | null = null;

export const promotions: Promotion[] = [];

export const upsellMap: Record<string, { name: string; icon: string; confidence: number }[]> = {};

export const networkNodes: NetworkNode[] = [];

export const networkEdges: NetworkEdge[] = [];

export const topCombinations: { name: string; support: number }[] = [];

export const associationRules: AssociationRule[] = [];

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { runApriori, parseCSV, type Rule, type FrequentItemset } from "@/lib/apriori";
import { apiEnabled, runAnalysisOnServer, fetchAnalysis, type ApiAnalysisResult } from "@/lib/api";
import type {
  MenuItem, ComboPattern, AssociationRule, Promotion,
  NetworkNode, NetworkEdge,
} from "@/data/dashboard-data";

const FOOD_ICONS: Record<string, string> = {
  chickenjoy: "🍗", rice: "🍚", coke: "🥤", "burger steak": "🍔",
  fries: "🍟", "jolly spaghetti": "🍝", spaghetti: "🍝",
  "peach mango pie": "🥧", pie: "🥧", "jolly palabok": "🍜",
  palabok: "🍜", "iced tea": "🧊", "chocolate sundae": "🍨",
  sundae: "🍨", "crispy fries": "🍟", burger: "🍔",
  hotdog: "🌭", drink: "🥤", dessert: "🍨", coffee: "☕",
};

function getIcon(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(FOOD_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return "🍽️";
}

export interface AnalysisState {
  totalTransactions: number;
  patternsDiscovered: number;
  lastUpdated: string | null;
  menuItems: MenuItem[];
  trendingCombos: ComboPattern[];
  aiRecommendedCombo: ComboPattern | null;
  promotions: Promotion[];
  upsellMap: Record<string, { name: string; icon: string; confidence: number }[]>;
  networkNodes: NetworkNode[];
  networkEdges: NetworkEdge[];
  topCombinations: { name: string; support: number }[];
  associationRules: AssociationRule[];
  isAnalyzing: boolean;
  runAnalysis: (csvText: string) => void;
}

const AnalysisContext = createContext<AnalysisState | null>(null);

export function useAnalysis() {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error("useAnalysis must be used within AnalysisProvider");
  return ctx;
}

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState({
    totalTransactions: 0,
    patternsDiscovered: 0,
    lastUpdated: null as string | null,
    menuItems: [] as MenuItem[],
    trendingCombos: [] as ComboPattern[],
    aiRecommendedCombo: null as ComboPattern | null,
    promotions: [] as Promotion[],
    upsellMap: {} as Record<string, { name: string; icon: string; confidence: number }[]>,
    networkNodes: [] as NetworkNode[],
    networkEdges: [] as NetworkEdge[],
    topCombinations: [] as { name: string; support: number }[],
    associationRules: [] as AssociationRule[],
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const processResults = useCallback(
    (transactions: string[][], frequentItemsets: FrequentItemset[], rules: Rule[]) => {
        // Extract unique items
        const uniqueItems = new Set<string>();
        transactions.forEach((t) => t.forEach((item) => uniqueItems.add(item)));
        const menuItems: MenuItem[] = [...uniqueItems].map((name) => ({
          id: name,
          name,
          icon: getIcon(name),
          category: "Menu",
        }));

        // Multi-item frequent sets sorted by support
        const multiSets = frequentItemsets
          .filter((f) => f.items.length >= 2)
          .sort((a, b) => b.support - a.support);

        // Trending combos (top 6)
        const trendingCombos: ComboPattern[] = multiSets.slice(0, 6).map((f, i) => ({
          id: `combo-${i}`,
          items: f.items,
          support: f.support,
          confidence: rules.find((r) => f.items.includes(r.consequent) && f.items.some((it) => r.antecedent.includes(it)))?.confidence || 0,
        }));

        // AI recommended combo (strongest by support * confidence)
        const bestRule = rules.length > 0 ? rules[0] : null;
        const bestSet = multiSets[0];
        const aiRecommendedCombo: ComboPattern | null = bestSet
          ? {
              id: "ai-combo",
              items: bestSet.items,
              support: bestSet.support,
              confidence: bestRule?.confidence || 0,
              lift: bestRule?.lift || 0,
              estimatedSalesIncrease: bestRule ? +(bestRule.lift * 3.5).toFixed(0) : 0,
            }
          : null;

        // Promotions (top 3 rules with high lift)
        const promoRules = [...rules].sort((a, b) => b.lift - a.lift).slice(0, 3);
        const promotions: Promotion[] = promoRules.map((r, i) => ({
          id: `promo-${i}`,
          description: `Buy ${r.antecedent} → Get ${r.consequent} Discount`,
          support: r.support,
          confidence: r.confidence,
          estimatedIncrease: +(r.lift * 2.8).toFixed(0),
        }));

        // Upsell map
        const upsellMap: Record<string, { name: string; icon: string; confidence: number }[]> = {};
        for (const item of menuItems) {
          const matching = rules
            .filter((r) => r.antecedent === item.name)
            .sort((a, b) => b.confidence - a.confidence)
            .slice(0, 4);
          if (matching.length > 0) {
            upsellMap[item.id] = matching.map((r) => ({
              name: r.consequent,
              icon: getIcon(r.consequent),
              confidence: r.confidence,
            }));
          }
        }

        // Network graph
        const nodeItems = [...uniqueItems].slice(0, 10);
        const angleStep = (2 * Math.PI) / nodeItems.length;
        const cx = 310, cy = 210, radius = 150;
        const networkNodes: NetworkNode[] = nodeItems.map((name, i) => ({
          id: name,
          label: `${getIcon(name)} ${name}`,
          x: cx + radius * Math.cos(angleStep * i - Math.PI / 2),
          y: cy + radius * Math.sin(angleStep * i - Math.PI / 2),
        }));

        const networkEdges: NetworkEdge[] = [];
        const edgeSeen = new Set<string>();
        for (const r of rules) {
          const parts = r.antecedent.split(" + ");
          for (const ant of parts) {
            const key = [ant, r.consequent].sort().join("||");
            if (!edgeSeen.has(key) && nodeItems.includes(ant) && nodeItems.includes(r.consequent)) {
              edgeSeen.add(key);
              networkEdges.push({ source: ant, target: r.consequent, weight: Math.min(r.lift, 5) });
            }
          }
        }

        // Top combinations chart
        const topCombinations = multiSets.slice(0, 8).map((f) => ({
          name: f.items.join(" + "),
          support: f.support,
        }));

        // Association rules table
        const associationRules: AssociationRule[] = rules.slice(0, 15).map((r) => ({
          antecedent: r.antecedent,
          consequent: r.consequent,
          support: r.support,
          confidence: r.confidence,
          lift: r.lift,
        }));

        setState({
          totalTransactions: transactions.length,
          patternsDiscovered: multiSets.length,
          lastUpdated: new Date().toLocaleString(),
          menuItems,
          trendingCombos,
          aiRecommendedCombo,
          promotions,
          upsellMap,
          networkNodes,
          networkEdges,
          topCombinations,
          associationRules,
        });
  }, []);

  const runAnalysis = useCallback((csvText: string) => {
    setIsAnalyzing(true);

    const transactions = parseCSV(csvText);
    if (transactions.length === 0) {
      setIsAnalyzing(false);
      return;
    }

    if (apiEnabled()) {
      // Use Python backend
      runAnalysisOnServer(transactions)
        .then((result) => {
          processResults(transactions, result.frequentItemsets, result.rules);
        })
        .catch((err) => {
          console.warn("API failed, falling back to in-browser analysis:", err);
          const { frequentItemsets, rules } = runApriori(transactions, 2, 25, 4);
          processResults(transactions, frequentItemsets, rules);
        })
        .finally(() => setIsAnalyzing(false));
    } else {
      // In-browser fallback
      setTimeout(() => {
        try {
          const { frequentItemsets, rules } = runApriori(transactions, 2, 25, 4);
          processResults(transactions, frequentItemsets, rules);

      } catch (e) {
        console.error("Analysis error:", e);
      } finally {
        setIsAnalyzing(false);
      }
    }, 100);
    }
  }, [processResults]);

  return (
    <AnalysisContext.Provider value={{ ...state, isAnalyzing, runAnalysis }}>
      {children}
    </AnalysisContext.Provider>
  );
}

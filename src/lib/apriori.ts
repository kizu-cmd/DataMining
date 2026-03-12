// Simple in-browser Apriori algorithm for Market Basket Analysis

export type Transaction = string[];

export interface FrequentItemset {
  items: string[];
  support: number; // as percentage
  count: number;
}

export interface Rule {
  antecedent: string;
  consequent: string;
  support: number;
  confidence: number;
  lift: number;
  leverage: number;
  conviction: number;
}

function getItemCounts(transactions: Transaction[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const t of transactions) {
    const unique = [...new Set(t)];
    for (const item of unique) {
      counts.set(item, (counts.get(item) || 0) + 1);
    }
  }
  return counts;
}

function getCombinationKey(items: string[]): string {
  return [...items].sort().join("||");
}

function generateCandidates(prevItemsets: string[][], size: number): string[][] {
  const candidates: string[][] = [];
  const seen = new Set<string>();
  for (let i = 0; i < prevItemsets.length; i++) {
    for (let j = i + 1; j < prevItemsets.length; j++) {
      const merged = [...new Set([...prevItemsets[i], ...prevItemsets[j]])].sort();
      if (merged.length === size) {
        const key = getCombinationKey(merged);
        if (!seen.has(key)) {
          seen.add(key);
          candidates.push(merged);
        }
      }
    }
  }
  return candidates;
}

function countSupport(transactions: Transaction[], itemset: string[]): number {
  let count = 0;
  for (const t of transactions) {
    if (itemset.every((item) => t.includes(item))) count++;
  }
  return count;
}

export function runApriori(
  transactions: Transaction[],
  minSupportPct: number = 2,
  minConfidencePct: number = 30,
  maxSetSize: number = 4
): { frequentItemsets: FrequentItemset[]; rules: Rule[] } {
  const n = transactions.length;
  if (n === 0) return { frequentItemsets: [], rules: [] };

  const minSupportCount = Math.max(1, Math.floor((minSupportPct / 100) * n));
  const allFrequent: FrequentItemset[] = [];

  // Level 1: single items
  const itemCounts = getItemCounts(transactions);
  let currentLevel: string[][] = [];
  itemCounts.forEach((count, item) => {
    if (count >= minSupportCount) {
      currentLevel.push([item]);
      allFrequent.push({ items: [item], support: +((count / n) * 100).toFixed(1), count });
    }
  });

  // Levels 2+
  for (let size = 2; size <= maxSetSize && currentLevel.length > 0; size++) {
    const candidates = generateCandidates(currentLevel, size);
    const nextLevel: string[][] = [];
    for (const candidate of candidates) {
      const count = countSupport(transactions, candidate);
      if (count >= minSupportCount) {
        nextLevel.push(candidate);
        allFrequent.push({ items: candidate, support: +((count / n) * 100).toFixed(1), count });
      }
    }
    currentLevel = nextLevel;
  }

  // Generate association rules from itemsets of size >= 2
  const rules: Rule[] = [];
  const multiItemsets = allFrequent.filter((f) => f.items.length >= 2);

  for (const itemset of multiItemsets) {
    // Generate all possible antecedent/consequent splits
    for (let i = 0; i < itemset.items.length; i++) {
      const consequent = itemset.items[i];
      const antecedentItems = itemset.items.filter((_, idx) => idx !== i);
      const antecedentKey = getCombinationKey(antecedentItems);
      const antecedentFreq = allFrequent.find(
        (f) => getCombinationKey(f.items) === antecedentKey
      );
      const consequentFreq = allFrequent.find(
        (f) => f.items.length === 1 && f.items[0] === consequent
      );

      if (antecedentFreq && consequentFreq) {
        const confidence = +((itemset.count / antecedentFreq.count) * 100).toFixed(1);
        if (confidence >= minConfidencePct) {
          const lift = +(
            (itemset.support / 100) /
            ((antecedentFreq.support / 100) * (consequentFreq.support / 100))
          ).toFixed(2);
          const supportFrac = itemset.support / 100;
          const antecedentSupport = antecedentFreq.support / 100;
          const consequentSupport = consequentFreq.support / 100;
          const confidenceFrac = confidence / 100;
          const leverage = +(supportFrac - antecedentSupport * consequentSupport).toFixed(4);
          const conviction =
            confidenceFrac >= 0.999
              ? Number.POSITIVE_INFINITY
              : +(((1 - consequentSupport) / (1 - confidenceFrac))).toFixed(2);
          rules.push({
            antecedent: antecedentItems.join(" + "),
            consequent,
            support: itemset.support,
            confidence,
            lift,
            leverage,
            conviction,
          });
        }
      }
    }
  }

  rules.sort((a, b) => b.confidence - a.confidence);
  return { frequentItemsets: allFrequent, rules };
}

// Parse CSV: expects either a single column of comma-separated items per row,
// or a column named "items" / "products", or multiple item columns
export function parseCSV(text: string): Transaction[] {
  const lines = text.trim().split("\n").filter(Boolean);
  if (lines.length < 2) return [];

  const header = lines[0].toLowerCase();
  const transactions: Transaction[] = [];

  // Check if it has a header with "item" or "product"
  const cols = header.split(",").map((c) => c.trim());
  const itemColIdx = cols.findIndex(
    (c) => c.includes("item") || c.includes("product") || c.includes("menu")
  );

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (itemColIdx >= 0) {
      // Single column with items
      const parts = line.split(",");
      const items = parts
        .slice(itemColIdx)
        .join(",")
        .split(/[,;|]/)
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
      if (items.length > 0) transactions.push(items);
    } else {
      // Treat each comma-separated value as an item
      const items = line
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
      if (items.length > 0) transactions.push(items);
    }
  }

  return transactions;
}

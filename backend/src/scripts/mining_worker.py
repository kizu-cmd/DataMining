import json
import sys
from collections import defaultdict

import pandas as pd
from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import fpgrowth, association_rules


def dynamic_min_support(transaction_count: int) -> float:
    # Lower support as data grows. Clamp between 0.005 and 0.05.
    if transaction_count <= 0:
        return 0.05
    support = 20.0 / float(transaction_count)
    return max(0.005, min(0.05, support))


def score_rules(rules_df: pd.DataFrame) -> pd.DataFrame:
    scored = rules_df.copy()
    scored["score"] = (
        0.4 * scored["lift"] +
        0.35 * scored["confidence"] +
        0.25 * scored["support"]
    )
    return scored.sort_values(by="score", ascending=False).reset_index(drop=True)


def load_transactions_from_json(raw_json: str):
    rows = json.loads(raw_json)
    grouped = defaultdict(list)
    for row in rows:
        order_id = row.get("order_id")
        item = row.get("item")
        if not order_id or not item:
            continue
        grouped[str(order_id)].append(str(item).strip())

    transactions = []
    for _, items in grouped.items():
        # Deduplicate items per order while preserving order
        seen = set()
        unique_items = []
        for item in items:
            if item not in seen:
                seen.add(item)
                unique_items.append(item)
        if unique_items:
            transactions.append(unique_items)

    return transactions


def run_mining(transactions):
    if not transactions:
        return {"frequent_itemsets": [], "rules": []}

    min_support = dynamic_min_support(len(transactions))
    min_confidence = 0.3

    te = TransactionEncoder()
    te_array = te.fit(transactions).transform(transactions)
    encoded_df = pd.DataFrame(te_array, columns=te.columns_)

    frequent_itemsets = fpgrowth(
        encoded_df,
        min_support=min_support,
        use_colnames=True
    )

    if frequent_itemsets.empty:
        return {"frequent_itemsets": [], "rules": []}

    frequent_itemsets = frequent_itemsets.sort_values(
        by="support",
        ascending=False
    ).reset_index(drop=True)

    itemsets_out = []
    total_count = len(transactions)
    for _, row in frequent_itemsets.iterrows():
        items = sorted(list(row["itemsets"]))
        support_frac = float(row["support"])
        itemsets_out.append({
            "items": items,
            "support": round(support_frac * 100, 4),
            "count": int(round(support_frac * total_count)),
        })

    rules = association_rules(
        frequent_itemsets,
        metric="confidence",
        min_threshold=min_confidence
    )

    if rules.empty:
        return {"frequent_itemsets": itemsets_out, "rules": []}

    rules = rules[["antecedents", "consequents", "support", "confidence", "lift"]]
    rules = score_rules(rules)

    top = rules.head(10)
    rules_out = []
    for _, row in top.iterrows():
        support_frac = float(row["support"])
        confidence_frac = float(row["confidence"])
        rules_out.append({
            "antecedents": sorted(list(row["antecedents"])),
            "consequents": sorted(list(row["consequents"])),
            "support": round(support_frac * 100, 4),
            "confidence": round(confidence_frac * 100, 4),
            "lift": float(row["lift"]),
            "score": float(row["score"]),
        })

    return {"frequent_itemsets": itemsets_out, "rules": rules_out}


def main():
    raw = sys.stdin.read()
    transactions = load_transactions_from_json(raw)
    result = run_mining(transactions)
    sys.stdout.write(json.dumps(result))


if __name__ == "__main__":
    main()

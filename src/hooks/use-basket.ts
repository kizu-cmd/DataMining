import { useState, useCallback, useRef } from "react";
import type { BasketItem } from "@/data/basket-data";

interface StrikethroughState {
  active: boolean;
  oldSubtotal: number;
  oldTax: number;
  oldTotal: number;
}

export function useBasket(initial: BasketItem[]) {
  const [items, setItems] = useState<BasketItem[]>(initial);
  const [strike, setStrike] = useState<StrikethroughState>({
    active: false,
    oldSubtotal: 0,
    oldTax: 0,
    oldTotal: 0,
  });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const taxRate = 0.08;
  const tax = subtotal * taxRate;
  const shipping = subtotal > 0 ? 8.50 : 0;
  const total = subtotal + tax + shipping;

  const triggerStrike = useCallback(
    (oldSub: number, oldTx: number, oldTot: number) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setStrike({ active: true, oldSubtotal: oldSub, oldTax: oldTx, oldTotal: oldTot });
      timerRef.current = setTimeout(() => {
        setStrike((s) => ({ ...s, active: false }));
      }, 400);
    },
    []
  );

  const updateQuantity = useCallback(
    (id: string, newQty: number) => {
      if (newQty < 1) return;
      const oldSub = subtotal;
      const oldTx = tax;
      const oldTot = total;
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
      );
      triggerStrike(oldSub, oldTx, oldTot);
    },
    [subtotal, tax, total, triggerStrike]
  );

  const removeItem = useCallback(
    (id: string) => {
      const oldSub = subtotal;
      const oldTx = tax;
      const oldTot = total;
      setItems((prev) => prev.filter((item) => item.id !== id));
      triggerStrike(oldSub, oldTx, oldTot);
    },
    [subtotal, tax, total, triggerStrike]
  );

  return { items, subtotal, tax, shipping, total, strike, updateQuantity, removeItem };
}

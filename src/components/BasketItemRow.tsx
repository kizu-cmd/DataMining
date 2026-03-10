import { useState } from "react";
import type { BasketItem } from "@/data/basket-data";
import { X } from "lucide-react";

interface BasketItemRowProps {
  item: BasketItem;
  onQuantityChange: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

export function BasketItemRow({ item, onQuantityChange, onRemove }: BasketItemRowProps) {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(String(item.quantity));
  const lineTotal = item.price * item.quantity;

  const commitEdit = () => {
    const parsed = parseInt(inputValue, 10);
    if (!isNaN(parsed) && parsed >= 1) {
      onQuantityChange(item.id, parsed);
    } else {
      setInputValue(String(item.quantity));
    }
    setEditing(false);
  };

  return (
    <div className="py-5 flex items-start gap-4 sm:gap-6">
      {/* Item details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-heading text-base font-bold leading-tight">{item.name}</h3>
        <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>
        <div className="mt-2 flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">Qty:</span>
          {editing ? (
            <input
              type="number"
              min={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={(e) => e.key === "Enter" && commitEdit()}
              autoFocus
              className="w-12 border-b border-foreground bg-transparent text-center font-body text-sm outline-none focus:border-primary"
            />
          ) : (
            <button
              onClick={() => {
                setInputValue(String(item.quantity));
                setEditing(true);
              }}
              className="text-primary underline underline-offset-2 cursor-text tabular-nums"
            >
              {item.quantity}
            </button>
          )}
          <span className="text-muted-foreground">× ${item.price.toFixed(2)}/{item.unit}</span>
        </div>
      </div>

      {/* Line total & remove */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="font-heading font-bold tabular-nums">${lineTotal.toFixed(2)}</span>
        <button
          onClick={() => onRemove(item.id)}
          className="text-destructive hover:text-destructive/80 transition-colors flex items-center gap-1 text-xs mt-1"
          aria-label={`Remove ${item.name}`}
        >
          <X className="w-3.5 h-3.5" />
          <span>Remove</span>
        </button>
      </div>
    </div>
  );
}

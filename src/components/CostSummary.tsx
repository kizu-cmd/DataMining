interface CostSummaryProps {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  strike: {
    active: boolean;
    oldSubtotal: number;
    oldTax: number;
    oldTotal: number;
  };
}

function StrikeLine({ oldValue, newValue, active }: { oldValue: number; newValue: number; active: boolean }) {
  if (active) {
    return (
      <span className="relative tabular-nums">
        <span className="text-destructive line-through decoration-destructive decoration-2">
          ${oldValue.toFixed(2)}
        </span>
      </span>
    );
  }
  return <span className="tabular-nums">${newValue.toFixed(2)}</span>;
}

export function CostSummary({ subtotal, tax, shipping, total, strike }: CostSummaryProps) {
  return (
    <div className="py-5 space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Subtotal</span>
        <StrikeLine oldValue={strike.oldSubtotal} newValue={subtotal} active={strike.active} />
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Tax (8%)</span>
        <StrikeLine oldValue={strike.oldTax} newValue={tax} active={strike.active} />
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Shipping</span>
        <span className="tabular-nums">${shipping.toFixed(2)}</span>
      </div>
      <div className="border-t border-foreground pt-3 mt-3 flex justify-between font-heading text-lg font-bold">
        <span>Total</span>
        <StrikeLine oldValue={strike.oldTotal} newValue={total} active={strike.active} />
      </div>
    </div>
  );
}

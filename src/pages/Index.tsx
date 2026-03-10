import { initialBasketItems } from "@/data/basket-data";
import { useBasket } from "@/hooks/use-basket";
import { BasketItemRow } from "@/components/BasketItemRow";
import { CostSummary } from "@/components/CostSummary";

const Index = () => {
  const { items, subtotal, tax, shipping, total, strike, updateQuantity, removeItem } = useBasket(initialBasketItems);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[620px] mx-auto px-5 sm:px-8 pt-10 pb-48">
        {/* Header */}
        <header className="pb-5 border-b border-foreground">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight">Your Basket</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
        </header>

        {/* Item List */}
        {items.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">Your basket is empty.</p>
            <a href="#" className="text-primary underline underline-offset-2 text-sm mt-2 inline-block">
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="divide-y divide-foreground/15">
            {items.map((item) => (
              <BasketItemRow
                key={item.id}
                item={item}
                onQuantityChange={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>
        )}
      </div>

      {/* Sticky bottom: Cost Summary + Action */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-foreground">
          <div className="max-w-[620px] mx-auto px-5 sm:px-8">
            <CostSummary
              subtotal={subtotal}
              tax={tax}
              shipping={shipping}
              total={total}
              strike={strike}
            />
            <div className="pb-5 flex flex-col sm:flex-row items-center gap-3">
              <button className="w-full sm:flex-1 bg-primary text-primary-foreground font-heading font-bold text-base py-3 px-6 hover:bg-primary/90 transition-colors">
                Proceed to Checkout
              </button>
              <a
                href="#"
                className="text-primary underline underline-offset-2 text-sm"
              >
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;

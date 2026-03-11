import { useState, useMemo } from "react";
import { useAnalysis } from "@/context/AnalysisContext";
import { ShoppingCart, Plus, Minus, Trash2, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartItem {
  id: string;
  name: string;
  icon: string;
  price: number;
  quantity: number;
}

const DUMMY_PRICES: Record<string, number> = {
  chickenjoy: 89, rice: 25, coke: 45, "burger steak": 75, fries: 55,
  "jolly spaghetti": 65, spaghetti: 65, "peach mango pie": 39, pie: 39,
  "jolly palabok": 75, palabok: 75, "iced tea": 39, "chocolate sundae": 35,
  sundae: 35, "crispy fries": 55, burger: 75, hotdog: 49, drink: 39,
  dessert: 35, coffee: 55,
};

function getPrice(name: string): number {
  const lower = name.toLowerCase();
  for (const [key, price] of Object.entries(DUMMY_PRICES)) {
    if (lower.includes(key)) return price;
  }
  return 59;
}

export default function Kiosk() {
  const { menuItems, upsellMap, trendingCombos } = useAnalysis();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const hasData = menuItems.length > 0;

  const categories = useMemo(() => {
    if (!hasData) return [];
    return menuItems.map((m) => ({
      ...m,
      price: getPrice(m.name),
    }));
  }, [menuItems, hasData]);

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  // Get upsell suggestions based on cart items
  const upsellSuggestions = useMemo(() => {
    const suggestions = new Map<string, { name: string; icon: string; confidence: number }>();
    for (const item of cart) {
      const ups = upsellMap[item.id] || [];
      for (const u of ups) {
        if (!cart.some((c) => c.name === u.name) && !suggestions.has(u.name)) {
          suggestions.set(u.name, u);
        }
      }
    }
    return [...suggestions.values()].slice(0, 4);
  }, [cart, upsellMap]);

  const addToCart = (id: string, name: string, icon: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { id, name, icon, price: getPrice(name), quantity: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  const loadSampleData = () => {
    const sampleCSV = `transaction_id,items
1,"Chickenjoy,Rice,Coke"
2,"Chickenjoy,Rice,Jolly Spaghetti"
3,"Burger Steak,Rice,Iced Tea"
4,"Chickenjoy,Fries,Coke"
5,"Jolly Spaghetti,Peach Mango Pie,Coke"
6,"Chickenjoy,Rice,Peach Mango Pie"
7,"Burger Steak,Rice,Coke,Fries"
8,"Chickenjoy,Rice,Chocolate Sundae"
9,"Jolly Palabok,Coke,Peach Mango Pie"
10,"Chickenjoy,Jolly Spaghetti,Coke"
11,"Chickenjoy,Rice,Iced Tea,Fries"
12,"Burger Steak,Rice,Jolly Spaghetti"
13,"Chickenjoy,Rice,Coke,Peach Mango Pie"
14,"Fries,Coke,Chocolate Sundae"
15,"Chickenjoy,Rice,Coke"
16,"Jolly Spaghetti,Coke,Fries"
17,"Chickenjoy,Rice,Peach Mango Pie,Iced Tea"
18,"Burger Steak,Fries,Coke"
19,"Chickenjoy,Rice,Jolly Palabok,Coke"
20,"Chickenjoy,Rice,Coke,Chocolate Sundae"`;
    runAnalysis(sampleCSV);
  };

  if (!hasData) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-16">
        <div className="kiosk-empty">
          <span className="text-6xl block mb-4">🖥️</span>
          <h2 className="text-xl font-extrabold mb-2">Kiosk Not Available</h2>
          <p className="text-sm mb-4">Upload transaction data on the Dashboard first to populate the kiosk menu with AI-powered suggestions.</p>
          <Button onClick={loadSampleData} className="font-bold">
            <Sparkles className="w-4 h-4 mr-2" /> Load Sample Data
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6">
      {/* Kiosk Header */}
      <div className="promo-banner mb-6">
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-black text-primary-foreground tracking-tight">
            🖥️ Self-Order Kiosk
          </h1>
          <p className="text-primary-foreground/80 text-sm mt-1">
            Powered by Market Basket Intelligence · AI-driven upsells & combos
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu Grid */}
        <div className="lg:col-span-2">
          {/* Trending Combos */}
          {trendingCombos.length > 0 && (
            <div className="mb-6">
              <div className="kiosk-section-title">
                <h2>🔥 Recommended Combos</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {trendingCombos.slice(0, 4).map((combo) => (
                  <div
                    key={combo.id}
                    className="kiosk-card p-4 cursor-pointer border-2 border-transparent hover:border-accent transition-colors"
                    onClick={() => {
                      combo.items.forEach((itemName) => {
                        const mi = menuItems.find((m) => m.name === itemName);
                        if (mi) addToCart(mi.id, mi.name, mi.icon);
                      });
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-accent" />
                      <span className="kiosk-badge bg-accent/15 text-accent-foreground">
                        {combo.support}% popular
                      </span>
                    </div>
                    <p className="font-bold text-sm">
                      {combo.items.map((i) => {
                        const mi = menuItems.find((m) => m.name === i);
                        return mi ? `${mi.icon} ${mi.name}` : i;
                      }).join(" + ")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      ₱{combo.items.reduce((s, i) => s + getPrice(i), 0)} · Tap to add all
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Items */}
          <div className="kiosk-section-title">
            <h2>🍽️ Menu Items</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categories.map((item) => {
              const inCart = cart.find((c) => c.id === item.id);
              return (
                <div
                  key={item.id}
                  className={`kiosk-card p-4 text-center cursor-pointer transition-all ${
                    inCart ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => addToCart(item.id, item.name, item.icon)}
                >
                  <span className="text-4xl block mb-2">{item.icon}</span>
                  <p className="text-sm font-bold leading-tight">{item.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">₱{item.price}</p>
                  {inCart && (
                    <span className="kiosk-badge bg-primary text-primary-foreground mt-2">
                      ×{inCart.quantity}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Cart Sidebar (desktop) */}
        <div className="hidden lg:block">
          <div className="kiosk-card p-5 sticky top-20">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="w-5 h-5 text-primary" />
              <h3 className="font-extrabold text-lg">Your Order</h3>
              {cart.length > 0 && (
                <button onClick={clearCart} className="ml-auto text-xs text-destructive hover:underline">
                  Clear
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Tap items to add them to your order
              </p>
            ) : (
              <>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">₱{item.price} each</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-muted-foreground/20"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold tabular-nums">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-muted-foreground/20"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Upsell Suggestions */}
                {upsellSuggestions.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-accent" /> AI Suggests
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {upsellSuggestions.map((s) => (
                        <button
                          key={s.name}
                          onClick={() => {
                            const mi = menuItems.find((m) => m.name === s.name);
                            if (mi) addToCart(mi.id, mi.name, mi.icon);
                          }}
                          className="kiosk-card p-2 text-center text-xs hover:border-accent border-2 border-transparent transition-colors"
                        >
                          <span className="text-lg block">{s.icon}</span>
                          <p className="font-bold truncate">{s.name}</p>
                          <span className="text-[10px] text-accent-foreground">{s.confidence}% match</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Items</span>
                    <span className="font-bold">{cartCount}</span>
                  </div>
                  <div className="flex justify-between text-lg font-extrabold">
                    <span>Total</span>
                    <span className="text-primary">₱{cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button className="w-full mt-4 font-extrabold text-base h-12 rounded-xl">
                  Place Order
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Cart FAB */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowCart(true)}
          className="relative bg-primary text-primary-foreground w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        >
          <ShoppingCart className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Cart Drawer */}
      {showCart && (
        <div className="lg:hidden fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm" onClick={() => setShowCart(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" /> Your Order
              </h3>
              <button onClick={() => setShowCart(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">₱{item.price}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {upsellSuggestions.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">🤖 AI Suggests</p>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {upsellSuggestions.map((s) => (
                        <button
                          key={s.name}
                          onClick={() => {
                            const mi = menuItems.find((m) => m.name === s.name);
                            if (mi) addToCart(mi.id, mi.name, mi.icon);
                          }}
                          className="kiosk-card p-2 text-center text-xs shrink-0 w-20"
                        >
                          <span className="text-lg block">{s.icon}</span>
                          <p className="font-bold truncate">{s.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t flex justify-between text-lg font-extrabold">
                  <span>Total</span>
                  <span className="text-primary">₱{cartTotal.toFixed(2)}</span>
                </div>
                <Button className="w-full mt-4 font-extrabold text-base h-12 rounded-xl" onClick={() => setShowCart(false)}>
                  Place Order
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

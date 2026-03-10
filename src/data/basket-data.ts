export interface BasketItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
}

export const initialBasketItems: BasketItem[] = [
  {
    id: "1",
    name: "Hand-Forged Paring Knife",
    description: "Carbon steel, walnut handle. 3.5\" blade.",
    price: 78.00,
    quantity: 1,
    unit: "each",
  },
  {
    id: "2",
    name: "Heritage Linen Dishtowel",
    description: "Undyed flax, plain weave. 18\" × 28\".",
    price: 24.00,
    quantity: 3,
    unit: "each",
  },
  {
    id: "3",
    name: "Cold-Pressed Rapeseed Oil",
    description: "Single-estate, 500ml. Kent, England.",
    price: 14.50,
    quantity: 2,
    unit: "bottle",
  },
  {
    id: "4",
    name: "Brass Drawer Pull, Knurled",
    description: "Unlacquered, solid brass. 96mm center.",
    price: 32.00,
    quantity: 4,
    unit: "each",
  },
];

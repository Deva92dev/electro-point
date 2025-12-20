import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: number;
  name: string;
  productType: string;
  color: string;
  price: number;
  image: string;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
};

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        set((state) => {
          const existing = state.items.find((v) => v.id === newItem.id);
          if (existing) {
            const haveItem = state.items.map((i) =>
              i.id === existing.id ? i.quantity + 1 : i
            );
          } else {
            return { items: [...state.items, newItem.quantity + 1] };
          }
        });
      },
      removeItem: (id) => {},
    }),
    { name: "electro-cart-storage" }
  )
);

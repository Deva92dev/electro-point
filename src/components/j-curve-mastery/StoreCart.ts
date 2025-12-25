import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: number;
  name: string;
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

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        const existing = get().items.find((i) => i.id === newItem.id);
        if (existing) {
          set({
            items: get().items.map((item) => {
              if (item.id === newItem.id) {
                return { ...item, quantity: item.quantity + 1 };
              } else {
                return item;
              }
            }),
          });
        } else {
          // you can use set like this to make adjustments adding new item
          set({
            items: [...get().items, { ...newItem, quantity: 1 }],
          });
        }
      },
      removeItem: (id) => {},
    }),
    { name: "electro-cart-storage" }
  )
);

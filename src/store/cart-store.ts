import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
  productId: number;
  variantId?: number; // optional if no variant is selected
  name: string;
  price: number;
  image: string;
  color?: string;
  quantity: number;
  maxStock: number;
  lowStockThreshold?: number;
};

interface CartState {
  items: CartItem[];
  isOpen: boolean; // controls the UI sheet
  addItem: (item: CartItem) => void;
  removeItem: (productId: number, variantId?: number) => void;
  updateQuantity: (
    productId: number,
    variantId: number | undefined,
    quantity: number
  ) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;

  isSynced: boolean; // Tracks if prices are real
  setSynced: (synced: boolean) => void;
  syncWithServer: (validItems: CartItem[]) => void; //  Replaces local items with server truth
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isSynced: false,

      addItem: (newItem) => {
        const { items } = get();
        // check if the item exists
        const existingItem = items.find(
          (i) =>
            i.productId === newItem.productId &&
            i.variantId === newItem.variantId
        );

        if (existingItem) {
          const newQty = Math.min(
            existingItem.quantity + newItem.quantity,
            newItem.maxStock
          );
          set({
            items: items.map((i) =>
              i.productId === newItem.productId &&
              i.variantId === newItem.variantId
                ? { ...i, quantity: newQty }
                : i
            ),
            isOpen: true,
            isSynced: false,
          });
        } else {
          // add new item
          set({ items: [...items, newItem], isOpen: true });
        }
      },

      removeItem: (pid, vid) => {
        set({
          items: get().items.filter(
            (i) => !(i.productId === pid && i.variantId === vid)
          ),
          isSynced: false, // Mark as unsynced
        });
      },

      updateQuantity: (pid, vid, qty) => {
        set({
          items: get().items.map((i) => {
            if (i.productId === pid && i.variantId === vid) {
              const validQty = Math.max(1, Math.min(qty, i.maxStock));
              return { ...i, quantity: validQty };
            }
            return i;
          }),
          isSynced: false, // Mark as unsynced
        });
      },

      clearCart: () => set({ items: [], isSynced: true }), // Empty is always synced
      toggleCart: () => set({ isOpen: !get().isOpen }),

      getCartTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      // Sync Actions
      setSynced: (val) => set({ isSynced: val }),

      syncWithServer: (validItems) =>
        set({ items: validItems, isSynced: true }),
    }),
    {
      name: "electropoint-cart",
      storage: createJSONStorage(() => localStorage),
      // don't want to persist 'isOpen'
      partialize: (state) => ({
        items: state.items,
        isSynced: state.isSynced,
      }),
    }
  )
);

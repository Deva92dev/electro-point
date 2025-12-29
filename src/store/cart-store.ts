import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  productId: number;
  variantId?: number;
  name: string;
  price: number;
  image: string;
  color?: string;
  quantity: number;
  maxStock: number;
  lowStockThreshold?: number;
}

// Helper to generate consistent IDs
const getCartItemId = (productId: number, variantId?: number | null) => {
  const pid = productId;
  const vid = variantId ? variantId : "base";
  return `p${pid}-v${vid}`;
};

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isSynced: boolean;

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

  setSynced: (synced: boolean) => void;
  syncWithServer: (validItems: CartItem[]) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isSynced: false,

      addItem: (newItem) => {
        const { items } = get();
        // Force valid ID generation
        const newItemId = getCartItemId(
          newItem.productId,
          newItem.variantId || null
        );

        const existingItemIndex = items.findIndex(
          (i) => getCartItemId(i.productId, i.variantId || null) === newItemId
        );

        if (existingItemIndex > -1) {
          const existingItem = items[existingItemIndex];

          if (!existingItem) return;

          const newQty = Math.min(
            existingItem.quantity + newItem.quantity,
            existingItem.maxStock
          );

          const updatedItems = [...items];
          updatedItems[existingItemIndex] = {
            ...existingItem,
            quantity: newQty,
          };

          set({ items: updatedItems, isOpen: true, isSynced: false });
        } else {
          set({ items: [...items, newItem], isOpen: true, isSynced: false });
        }
      },

      removeItem: (pid, vid) => {
        const targetId = getCartItemId(pid, vid || null);
        set({
          items: get().items.filter(
            (i) => getCartItemId(i.productId, i.variantId || null) !== targetId
          ),
          isSynced: false,
        });
      },

      updateQuantity: (pid, vid, qty) => {
        const targetId = getCartItemId(pid, vid || null);
        set({
          items: get().items.map((i) => {
            if (getCartItemId(i.productId, i.variantId || null) === targetId) {
              // Ensure we don't exceed stock or go below 1
              const validQty = Math.max(1, Math.min(qty, i.maxStock));
              return { ...i, quantity: validQty };
            }
            return i;
          }),
          isSynced: false,
        });
      },

      clearCart: () => set({ items: [], isSynced: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),

      getCartTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      setSynced: (val) => set({ isSynced: val }),

      syncWithServer: (serverItems) => {
        // Force overwrite from server
        set({
          items: serverItems,
          isSynced: true,
        });
      },
    }),
    {
      name: "electropoint-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        isSynced: state.isSynced,
      }),
      skipHydration: false,
    }
  )
);

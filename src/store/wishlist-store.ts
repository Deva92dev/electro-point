import { create } from "zustand";

interface WishlistState {
  wishlistIds: number[];
  addItem: (id: number) => void;
  removeItem: (id: number) => void;
  setWishlist: (ids: number[]) => void;
  hasItem: (id: number) => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlistIds: [],

  addItem: (id) =>
    set((state) => ({
      wishlistIds: [...state.wishlistIds, id],
    })),

  removeItem: (id) =>
    set((state) => ({
      wishlistIds: state.wishlistIds.filter((itemId) => itemId !== id),
    })),

  setWishlist: (ids) => set({ wishlistIds: ids }),

  hasItem: (id) => get().wishlistIds.includes(id),
}));

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  totalPrice: number;
  availability: string | number;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
}

// Safe storage implementation
const storage = {
  getItem: (key: string) => {
    if (typeof globalThis !== "undefined" && (globalThis as Record<string, any>).__STORAGE__) {
      const storedValue = (globalThis as any).__STORAGE__[key];
      return storedValue ? JSON.parse(storedValue) : null;
    }
    return null;
  },
  setItem: (key: string, value: any) => {
    if (typeof globalThis !== "undefined") {
      if (!(globalThis as any).__STORAGE__) {
        (globalThis as any).__STORAGE__ = {};
      }
      (globalThis as any).__STORAGE__[key] = JSON.stringify(value);
    }
  },
  removeItem: (key: string) => {
    if (typeof globalThis !== "undefined" && (globalThis as Record<string, any>).__STORAGE__) {
      delete (globalThis as any).__STORAGE__[key];
    }
  },
};

const initialState: CartState = {
  items: storage.getItem("cartItems") || [],
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload;
      const existingItemIndex = state.items.findIndex((item) => item.id === newItem.id);
      
      if (existingItemIndex >= 0) {
        // Item exists, update its quantity and total price
        const existingItem = state.items[existingItemIndex];
        existingItem.quantity += newItem.quantity;
        existingItem.totalPrice = existingItem.price * existingItem.quantity;
      } else {
        // Item does not exist, add it
        state.items.push({
          ...newItem,
          totalPrice: newItem.price * newItem.quantity,
        });
      }

      // Recalculate total amount
      state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0);
      storage.setItem("cartItems", state.items);
    },

    removeItem: (state, action: PayloadAction<{ id: string }>) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
      // Recalculate total amount
      state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0);
      storage.setItem("cartItems", state.items);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      storage.removeItem("cartItems");
    },

    // Experimental, used for preventing adding more than available quantity in sidecart
    updateItemQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        // Convert availability to a number if possible
        const availableQuantity = parseInt(existingItem.availability.toString(), 10);
        const isNumericAvailability = !isNaN(availableQuantity);

        // Prevent updating quantity beyond available stock
        if (isNumericAvailability && quantity > availableQuantity) {
          return;
        }

        existingItem.quantity = quantity;
        existingItem.totalPrice = existingItem.price * existingItem.quantity;

        // Recalculate total amount
        state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0);
        storage.setItem("cartItems", state.items);
      }
    },

  },
});

export const { addItem, removeItem, clearCart, updateItemQuantity } = cartSlice.actions;
export default cartSlice.reducer;

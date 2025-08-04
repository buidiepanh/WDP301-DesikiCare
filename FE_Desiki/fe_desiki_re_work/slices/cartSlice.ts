import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Product {
  _id: string;
  name: string;
  description: string;
  volume: number;
  salePrice: number;
  gameTicketReward: number;
  isDeactivated: boolean;
  imageUrl: string;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  cartItem: {
    _id: string;
    cartId: string;
    productId: string;
    quantity: number;
    createdAt: string;
    updatedAt: string;
  };
  product: Product;
}

interface CartState {
  cartId: string | null;
  items: CartItem[];
}

const initialState: CartState = {
  cartId: null,
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart(
      state,
      action: PayloadAction<{ cartId: string; items: CartItem[] }>
    ) {
      state.cartId = action.payload.cartId;
      state.items = action.payload.items;
    },
    addItem(state, action: PayloadAction<CartItem>) {
      state.items.push(action.payload);
    },
    // Optimistic update - tăng quantity tạm thời cho UI
    incrementItemQuantity(state, action: PayloadAction<string>) {
      const productId = action.payload;
      const existingItem = state.items.find(
        (item) => item.product._id === productId
      );

      if (existingItem) {
        // Nếu đã có trong cart, tăng quantity
        existingItem.cartItem.quantity += 1;
      } else {
        // Nếu chưa có, có thể thêm placeholder hoặc không làm gì
        // Ở đây tôi sẽ không làm gì, chờ API response để add item mới
        console.log("Product not in cart yet, waiting for API response");
      }
    },
    // Update specific item quantity
    updateItemQuantity(
      state,
      action: PayloadAction<{ cartItemId: string; quantity: number }>
    ) {
      const { cartItemId, quantity } = action.payload;
      const existingItem = state.items.find(
        (item) => item.cartItem._id === cartItemId
      );

      if (existingItem) {
        existingItem.cartItem.quantity = quantity;
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        (i) => i.cartItem._id !== action.payload
      );
    },
    clearCart(state) {
      state.cartId = null;
      state.items = [];
    },
  },
});

export const {
  setCart,
  addItem,
  incrementItemQuantity,
  updateItemQuantity,
  removeItem,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;

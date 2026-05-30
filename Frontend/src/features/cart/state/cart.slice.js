import { createSlice } from '@reduxjs/toolkit';

// Each cart item stores product id, optional variant index, and quantity
const initialState = {
  items: [], // [{ productId, variantIdx?, quantity }]
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { productId, variantIdx } = action.payload;
      const existing = state.items.find(
        (i) => i.productId === productId && i.variantIdx === variantIdx
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ productId, variantIdx, quantity: 1 });
      }
    },
    removeItem: (state, action) => {
      const { productId, variantIdx } = action.payload;
      state.items = state.items.filter(
        (i) => !(i.productId === productId && i.variantIdx === variantIdx)
      );
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

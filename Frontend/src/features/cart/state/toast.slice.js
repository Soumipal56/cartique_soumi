import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    visible: false,
    product: null,   // { title, image, price, variantLabel }
};

const toastSlice = createSlice({
    name: 'toast',
    initialState,
    reducers: {
        showCartToast: (state, action) => {
            state.visible = true;
            state.product = action.payload;
        },
        hideCartToast: (state) => {
            state.visible = false;
            state.product = null;
        },
    },
});

export const { showCartToast, hideCartToast } = toastSlice.actions;
export default toastSlice.reducer;

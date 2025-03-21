import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isCartOpen: false
}

const cartUiSlice = createSlice({
    name: 'cartUi',
    initialState,
    reducers: {
        toggle: (state) => {
            state.isCartOpen = !state.isCartOpen;
        },
    },
});

export const CartUiAction = cartUiSlice.actions;
export default cartUiSlice.reducer;
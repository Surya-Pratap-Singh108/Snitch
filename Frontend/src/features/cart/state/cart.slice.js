import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        totalPrice:null,
        currency:null,
        items: [],
    },
    reducers: {
        setCart: (state, action) => {
            state.items = action.payload.items || [];
            state.totalPrice = action.payload.totalPrice || 0;
            state.currency = action.payload.currency || 'INR';
        },
        removeItem: (state, action) => {
            const { productId, variantId } = action.payload;
            state.items = state.items.filter(item => {
                return !(item.product._id.toString() === productId &&
                    item.variant.toString() === variantId);
            });
        },
        incrementCartItem: (state, action) => {
            const { productId, variantId } = action.payload;
            state.items = state.items.map(item => {
                if (
                    item.product._id.toString() === productId &&
                    item.variant.toString() === variantId
                    ){
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            });
        },
        decrementCartItem: (state, action) => {
            const { productId, variantId } = action.payload;
            state.items = state.items.map(item => {
                if (
                    item.product._id.toString() === productId &&
                    item.variant.toString() === variantId
                    ){
                    return { ...item, quantity: item.quantity - 1 };
                }
                return item;
            });
        }
    }
}); 

export const { setCart,removeItem,incrementCartItem,decrementCartItem } = cartSlice.actions;
export default cartSlice.reducer;

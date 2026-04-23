import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
    },
    reducers: {
        setItems: (state, action) => {
            state.items = action.payload;
        },
        addItem: (state, action) => {
            state.items.push(action.payload);
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

export const { setItems, addItem,removeItem,incrementCartItem,decrementCartItem } = cartSlice.actions;
export default cartSlice.reducer;

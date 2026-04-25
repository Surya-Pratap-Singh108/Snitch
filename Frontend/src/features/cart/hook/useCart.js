import { useDispatch, useSelector } from "react-redux"
import { addItemToCart, createCartOrder, decrementCartItemQuantity, getCart, incrementCartItemQuantity, removeItemFromCart, verifyCartOrder } from "../service/cart.api";
import {  decrementCartItem, incrementCartItem, removeItem, setCart } from "../state/cart.slice";
export const useCart = () => {

    const dispatch = useDispatch();
    const handleAddToCart = async ({ productId, variantId }) => {
        try {
            const response = await addItemToCart({ productId, variantId });
            return response;
        } catch (error) {
            console.error(error);
        }
    }
    const handleRemoveFromCart = async ({ productId, variantId }) => {
        try {
            const response = await removeItemFromCart({ productId, variantId });
            dispatch(removeItem({productId,variantId}));
            return response;
        } catch (error) {
            console.error(error);
        }
    }
    const handleGetCart = async () => {
        try {
            const response = await getCart();
            dispatch(setCart(response.cart));
            return response;
        } catch (error) {
            console.error(error);
        }
    }

    const handleIncrementCartItemQuantity = async ({ productId, variantId }) => {
        try {
            const response = await incrementCartItemQuantity({productId, variantId});
            dispatch(incrementCartItem({productId,variantId}));
            return response;
        } catch (error) {
            console.error(error);
        }
    }

    const handleDecrementCartItemQuantity = async ({ productId, variantId }) => {
        try {
            const response = await decrementCartItemQuantity({productId, variantId});
            dispatch(decrementCartItem({productId,variantId}));
            return response;
        } catch (error) {
            console.error(error);
        }
    }
    const handleCreateCartOrder = async () => {
        try {
            const response = await createCartOrder();
            return response;
        } catch (error) {
            console.error(error);
        }
    }
    const handleVerifyCartOrder = async ({razorpayPaymentId, razorpayOrderId, razorpaySignature}) => {
        try {
            const response = await verifyCartOrder({razorpayPaymentId, razorpayOrderId, razorpaySignature});
            return response?.success;
        } catch (error) {
            console.error(error);
        }
    }


    return { handleAddToCart,handleRemoveFromCart, handleGetCart,handleIncrementCartItemQuantity,handleDecrementCartItemQuantity,handleCreateCartOrder,handleVerifyCartOrder };
}
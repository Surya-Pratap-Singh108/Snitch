import { useDispatch, useSelector } from "react-redux"
import { addItemToCart, decrementCartItemQuantity, getCart, incrementCartItemQuantity, removeItemFromCart } from "../service/cart.api";
import { addItem, decrementCartItem, incrementCartItem, removeItem, setItems } from "../state/cart.slice";
export const useCart = () => {

    const dispatch = useDispatch();
    const handleAddToCart = async ({ productId, variantId }) => {
        try {
            const response = await addItemToCart({ productId, variantId });
            // dispatch(addItem(response.item));
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
            dispatch(setItems(response.cart.items));
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


    return { handleAddToCart,handleRemoveFromCart, handleGetCart,handleIncrementCartItemQuantity,handleDecrementCartItemQuantity };
}
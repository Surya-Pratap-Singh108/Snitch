import { useDispatch, useSelector } from "react-redux"
import { addItemToCart, getCart, incrementCartItemQuantity } from "../service/cart.api";
import { addItem, incrementCartItem, setItems } from "../state/cart.slice";
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


    return { handleAddToCart, handleGetCart,handleIncrementCartItemQuantity };
}
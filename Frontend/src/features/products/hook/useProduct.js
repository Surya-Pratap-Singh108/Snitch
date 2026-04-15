import { useDispatch } from "react-redux"
import { setError, setLoading, setSellerProducts } from "../state/product.slice";
import { createProduct, getSellerProducts } from "../services/product.api";


export const useProduct = () => {

    const dispatch = useDispatch();
    
    async function handlecreateProduct(formData) {

        try {
            setLoading(true);
            const response = await createProduct(formData);
            return response.product;

        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Create Product failed"));
        } finally {
            dispatch(setLoading(false));
        }
    }
    async function handlegetSellerProducts() {

        try {
            setLoading(true);
            const response = await getSellerProducts();
            setSellerProducts(response.products);
            return response.products;

        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Getting all Seller Products failed"));
        } finally {
            dispatch(setLoading(false));
        }
    }


    return { handlecreateProduct,handlegetSellerProducts };
}
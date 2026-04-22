import { useDispatch } from "react-redux"
import { setAllProducts, setError, setLoading, setSellerProducts } from "../state/product.slice";
import { addProductVariant, createProduct, getAllProducts, getProductById, getSellerProducts } from "../services/product.api";


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
            dispatch(setSellerProducts(response.products));
            return response.products;

        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Getting all Seller Products failed"));
        } finally {
            dispatch(setLoading(false));
        }
    }
    async  function handleGetAllProducts() {

        try {
            setLoading(true);
            const response = await getAllProducts();
            dispatch(setAllProducts(response.products));
            return response.products;

        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Getting all Products failed"));
        } finally {
            dispatch(setLoading(false));
        }
    }
    async  function handleGetProductById(productId) {

        try {
            setLoading(true);
            const response = await getProductById(productId);
            return response.product;

        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Getting all Products failed"));
        } finally {
            dispatch(setLoading(false));
        }
    }
    async function handleAddProductVariant(productId, newProductVariant) {

        try {
            setLoading(true);
            const response = await addProductVariant(productId, newProductVariant);
            return response;

        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Adding Product Variant failed"));
        } finally {
            dispatch(setLoading(false));
        }
    }
    

    return { handlecreateProduct,handlegetSellerProducts,handleGetAllProducts,handleGetProductById,handleAddProductVariant };
}
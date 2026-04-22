import axios from "axios";
const api = axios.create({
    baseURL: "/api/cart",
    withCredentials: true,
});

export const addItemToCart = async ({ productId, variantId }) => {
    const response = await api.post(`/add/${productId}/${variantId}`, { quantity: 1 });
    return response.data;
};

export const getCart = async () => {
    const response = await api.get(`/`);
    return response.data;
};

export const incrementCartItemQuantity = async ({productId,variantId}) => {
    const response = await api.patch(`/quantity/increment/${productId}/${variantId}`);
    return response.data;
};
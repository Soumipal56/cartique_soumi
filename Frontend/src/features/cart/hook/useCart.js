import { addToCart } from '../service/cart.api';

export const useCart = () => {

    const handleAddItem = async (productId, variantId, quantity = 1) => {
        const response = await addToCart(productId, variantId, quantity);
        return response;
    };

    return { handleAddItem };
};

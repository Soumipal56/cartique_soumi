import { addToCart, getCart } from '../service/cart.api';
import { useDispatch } from 'react-redux';
import { setItems } from '../state/cart.slice';

export const useCart = () => {
    const dispatch = useDispatch();

    const handleAddItem = async (productId, variantId, quantity = 1) => {
        const response = await addToCart(productId, variantId, quantity);
        return response;
    };

    const handleGetCart = async () => {
        try {
            const data = await getCart();
            dispatch(setItems(data.cart.items || []));
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        }
    };

    return { handleAddItem, handleGetCart };
};

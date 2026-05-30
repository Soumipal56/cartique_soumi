import { addToCart, getCart, updateCartItem, removeFromCart } from '../service/cart.api';
import { useDispatch } from 'react-redux';
import { setItems } from '../state/cart.slice';
import { showCartToast } from '../state/toast.slice';

export const useCart = () => {
    const dispatch = useDispatch();

    const handleAddItem = async (productId, variantId, quantity = 1, productInfo = null) => {
        const response = await addToCart(productId, variantId, quantity);
        if (productInfo) {
            dispatch(showCartToast(productInfo));
        }
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

    const handleUpdateQuantity = async (productId, variantId, quantity) => {
        try {
            await updateCartItem(productId, variantId, quantity);
            await handleGetCart(); // Refresh cart to get accurate total and quantity
        } catch (error) {
            console.error("Failed to update cart:", error);
        }
    };

    const handleRemoveItem = async (productId, variantId) => {
        try {
            await removeFromCart(productId, variantId);
            await handleGetCart(); // Refresh cart
        } catch (error) {
            console.error("Failed to remove item:", error);
        }
    };

    return { handleAddItem, handleGetCart, handleUpdateQuantity, handleRemoveItem };
};

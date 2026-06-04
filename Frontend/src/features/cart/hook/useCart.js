import { addToCart, getCart, updateCartItem, removeFromCart, createCartOrder, verifyCartOrder } from '../service/cart.api';
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
            let items = [];
            if (Array.isArray(data.cart)) {
                if (data.cart.length > 0) {
                    items = data.cart[0].items || [];
                }
            } else if (data.cart && data.cart.items) {
                items = data.cart.items;
            }
            dispatch(setItems(items));
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

    const handleCreateCartOrder = async (amount, currency) => {
        const data = await createCartOrder(amount, currency);
        return data; // Return full data object to get keyId as well
    };

    const handleVerifyCartOrder = async (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
        const data = await verifyCartOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature });
        return data.success;
    }

    return { handleAddItem, handleGetCart, handleUpdateQuantity, handleRemoveItem, handleCreateCartOrder, handleVerifyCartOrder };
};

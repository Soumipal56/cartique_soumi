import { addToCart, getCart, updateCartItem, removeFromCart, createCartOrder, verifyCartOrder, failCartOrder } from '../service/cart.api';
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

    const handleCreateCartOrder = async (amount, currency, addressId) => {
        try {
            const data = await createCartOrder(amount, currency, addressId);
            return data;
        } catch (err) {
            console.error(err);
            alert(err.message || "Failed to create order");
            return null;
        }
    };

    const handleVerifyCartOrder = async (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
        const data = await verifyCartOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature });
        return data.success;
    }

    const handleFailCartOrder = async (razorpay_order_id) => {
        try {
            const data = await failCartOrder(razorpay_order_id);
            return data.success;
        } catch (err) {
            console.error("Failed to mark order as failed:", err);
            return false;
        }
    };

    return { handleAddItem, handleGetCart, handleUpdateQuantity, handleRemoveItem, handleCreateCartOrder, handleVerifyCartOrder, handleFailCartOrder };
};

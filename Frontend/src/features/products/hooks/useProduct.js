import { createProduct, getSellerProduct } from "../service/product.api";
import { setSellerProducts } from "../state/product.slice";
import { useDispatch } from "react-redux";

export const useProduct = () => {
    const dispatch = useDispatch()


    async function handleCreateProduct(formData) {

        const data = await createProduct(formData)
        return data.product
    }

    async function handleGetSellerProduct() {
        try {
            const data = await getSellerProduct()
            dispatch(setSellerProducts(data.products))
            return data.products
        } catch (error) {
            console.error("Failed to fetch seller products:", error.response?.status, error.response?.data?.message || error.message)
            return []
        }
    }

    return { handleCreateProduct, handleGetSellerProduct }
}
import { createProduct, getSellerProduct, getAllProducts, getProductById, addProductVariant, deleteProduct, updateProduct } from "../service/product.api";
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

    async function handleGetAllProducts() {
        try {
            const data = await getAllProducts()
            return data.products
        } catch (error) {
            console.error("Failed to fetch all products:", error.response?.status, error.response?.data?.message || error.message)
            return []
        }
    }

    async function handleGetProductById(id) {
        try {
            const data = await getProductById(id)
            return data.product
        } catch (error) {
            console.error("Failed to fetch product:", error.response?.status, error.response?.data?.message || error.message)
            return null
        }
    }
    async function handleAddProductVariant(productId, newProductVariant) {
        try {
            const data = await addProductVariant(productId, newProductVariant);
            return data;
        } catch (error) {
            console.error("Failed to add product variant:", error.response?.status, error.response?.data?.message || error.message);
            throw error;
        }
    }



    async function handleUpdateProduct(id, formData) {
        try {
            const data = await updateProduct(id, formData);
            return data.product;
        } catch (error) {
            console.error("Failed to update product:", error.response?.status, error.response?.data?.message || error.message);
            throw error;
        }
    }

    async function handleDeleteProduct(id) {
        try {
            const data = await deleteProduct(id);
            return data;
        } catch (error) {
            console.error("Failed to delete product:", error.response?.status, error.response?.data?.message || error.message);
            throw error;
        }
    }

    return { handleCreateProduct, handleGetSellerProduct, handleGetAllProducts, handleGetProductById, handleAddProductVariant, handleDeleteProduct, handleUpdateProduct }
}
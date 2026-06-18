import axios from "axios";

const productApiInstance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/products`,
    withCredentials: true,
})

export async function createProduct(formData) {

    const response = await productApiInstance.post("/", formData)

    return response.data
}

export async function getSellerProduct() {

    const response = await productApiInstance.get("/seller")

    return response.data
}

export async function getAllProducts() {
    const response = await productApiInstance.get("/")
    return response.data
}



export async function updateProduct(id, productData) {
    const response = await productApiInstance.put(`/${id}`, productData)
    return response.data
}

export async function deleteProduct(id) {
    const response = await productApiInstance.delete(`/${id}`);
    return response.data;
}

export async function getProductById(id) {
    const response = await productApiInstance.get(`/${id}`)
    return response.data
}

export async function addProductVariant(productId, newProductVariant) {
    const formData = new FormData();

    newProductVariant.images.forEach((image) => {
        formData.append(`images`, image.file)
    });

    formData.append("stock", newProductVariant.stock);
    if (newProductVariant.price && newProductVariant.price.amount !== "" && newProductVariant.price.amount != null) {
        formData.append("priceAmount", newProductVariant.price.amount);
    }
    formData.append("attributes", JSON.stringify(newProductVariant.attributes))

    const response = await productApiInstance.post(`/${productId}/variants`, formData)

    return response.data
}
import axios from "axios";

const addressApiInstance = axios.create({
    baseURL: "http://localhost:3000/api/address",
    withCredentials: true,
});

export const addAddressApi = async (addressData) => {
    try {
        const response = await addressApiInstance.post("/", addressData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

export const getAddressesApi = async () => {
    try {
        const response = await addressApiInstance.get("/");
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

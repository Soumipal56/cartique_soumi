import axios from "axios";
import { config } from "../../../../config/config";

const API_URL = `${config.API_URL}/address`;

export const addAddressApi = async (addressData) => {
    try {
        const response = await axios.post(API_URL, addressData, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

export const getAddressesApi = async () => {
    try {
        const response = await axios.get(API_URL, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

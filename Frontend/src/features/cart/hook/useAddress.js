import { useState, useEffect } from 'react';
import { addAddressApi, getAddressesApi } from '../service/address.api';

export const useAddress = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAddresses = async () => {
        setLoading(true);
        try {
            const data = await getAddressesApi();
            if (data.success) {
                setAddresses(data.addresses);
            }
        } catch (error) {
            console.error("Failed to fetch addresses", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAddress = async (addressData) => {
        setLoading(true);
        try {
            const data = await addAddressApi(addressData);
            if (data.success) {
                alert(data.message || "Address added!");
                await fetchAddresses();
                return data.address;
            }
        } catch (error) {
            console.error(error);
            alert(error.message || "Failed to add address");
        } finally {
            setLoading(false);
        }
        return null;
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    return {
        addresses,
        loading,
        fetchAddresses,
        handleAddAddress
    };
};

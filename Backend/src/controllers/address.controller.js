import addressModel from "../models/address.model.js";

export const addAddress = async (req, res) => {
    try {
        const { fullName, phone, street, city, state, zipCode, country, isDefault } = req.body;
        
        // Basic validation
        if (!fullName || !phone || !street || !city || !state || !zipCode || !country) {
            return res.status(400).json({ message: "All address fields are required", success: false });
        }

        const newAddress = await addressModel.create({
            user: req.user._id,
            fullName,
            phone,
            street,
            city,
            state,
            zipCode,
            country,
            isDefault: isDefault || false
        });

        // If it's the first address, make it default automatically
        const userAddressesCount = await addressModel.countDocuments({ user: req.user._id });
        if (userAddressesCount === 1 && !newAddress.isDefault) {
            newAddress.isDefault = true;
            await newAddress.save();
        }

        return res.status(201).json({
            message: "Address added successfully",
            success: true,
            address: newAddress
        });
    } catch (err) {
        console.error("Error adding address:", err);
        return res.status(500).json({ message: "Failed to add address", success: false, error: err.message });
    }
};

export const getUserAddresses = async (req, res) => {
    try {
        const addresses = await addressModel.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
        
        return res.status(200).json({
            message: "Addresses fetched successfully",
            success: true,
            addresses
        });
    } catch (err) {
        console.error("Error fetching addresses:", err);
        return res.status(500).json({ message: "Failed to fetch addresses", success: false, error: err.message });
    }
};

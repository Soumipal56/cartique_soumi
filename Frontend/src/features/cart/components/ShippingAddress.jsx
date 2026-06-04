import React, { useState, useEffect } from 'react';
import { useAddress } from '../hook/useAddress';

const ShippingAddress = ({ onSelectAddress, selectedAddressId }) => {
    const { addresses, loading, handleAddAddress } = useAddress();
    const [isAdding, setIsAdding] = useState(false);
    
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
    });

    useEffect(() => {
        if (addresses.length > 0 && !selectedAddressId) {
            const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
            onSelectAddress(defaultAddr._id);
        }
    }, [addresses, selectedAddressId, onSelectAddress]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const submitAddress = async (e) => {
        e.preventDefault();
        const newAddr = await handleAddAddress(formData);
        if (newAddr) {
            setIsAdding(false);
            onSelectAddress(newAddr._id);
            setFormData({ fullName: '', phone: '', street: '', city: '', state: '', zipCode: '', country: 'India' });
        }
    };

    if (loading && addresses.length === 0) {
        return <div className="text-secondary text-sm">Loading addresses...</div>;
    }

    return (
        <div className="mb-6 border-b border-outline pb-6">
            <h3 className="font-serif text-lg font-semibold text-on-surface mb-4">Shipping Address</h3>
            
            {addresses.length > 0 && !isAdding ? (
                <div className="space-y-3">
                    {addresses.map((addr) => (
                        <label 
                            key={addr._id} 
                            className={`flex items-start p-3 rounded-xl border cursor-pointer transition-all ${
                                selectedAddressId === addr._id ? 'border-primary bg-primary/5' : 'border-outline hover:border-primary/50'
                            }`}
                        >
                            <input 
                                type="radio" 
                                name="address" 
                                value={addr._id}
                                checked={selectedAddressId === addr._id}
                                onChange={() => onSelectAddress(addr._id)}
                                className="mt-1 mr-3 accent-primary"
                            />
                            <div className="flex-1 text-sm">
                                <p className="font-medium text-on-surface">{addr.fullName} <span className="text-secondary font-normal ml-2">{addr.phone}</span></p>
                                <p className="text-secondary mt-1">{addr.street}, {addr.city}</p>
                                <p className="text-secondary">{addr.state}, {addr.zipCode}, {addr.country}</p>
                            </div>
                        </label>
                    ))}
                    <button 
                        onClick={() => setIsAdding(true)}
                        className="text-sm font-medium text-primary hover:underline flex items-center gap-1 mt-2"
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span> Add New Address
                    </button>
                </div>
            ) : (
                <form onSubmit={submitAddress} className="space-y-3">
                    <input type="text" name="fullName" placeholder="Full Name" required value={formData.fullName} onChange={handleChange} className="w-full px-4 py-2 border border-outline rounded-lg text-sm focus:outline-none focus:border-primary" />
                    <input type="text" name="phone" placeholder="Phone Number" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border border-outline rounded-lg text-sm focus:outline-none focus:border-primary" />
                    <input type="text" name="street" placeholder="Street Address" required value={formData.street} onChange={handleChange} className="w-full px-4 py-2 border border-outline rounded-lg text-sm focus:outline-none focus:border-primary" />
                    <div className="flex gap-3">
                        <input type="text" name="city" placeholder="City" required value={formData.city} onChange={handleChange} className="w-full px-4 py-2 border border-outline rounded-lg text-sm focus:outline-none focus:border-primary" />
                        <input type="text" name="state" placeholder="State" required value={formData.state} onChange={handleChange} className="w-full px-4 py-2 border border-outline rounded-lg text-sm focus:outline-none focus:border-primary" />
                    </div>
                    <div className="flex gap-3">
                        <input type="text" name="zipCode" placeholder="ZIP Code" required value={formData.zipCode} onChange={handleChange} className="w-full px-4 py-2 border border-outline rounded-lg text-sm focus:outline-none focus:border-primary" />
                        <input type="text" name="country" placeholder="Country" required value={formData.country} onChange={handleChange} className="w-full px-4 py-2 border border-outline rounded-lg text-sm focus:outline-none focus:border-primary" />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-container transition-colors">
                            Save Address
                        </button>
                        {addresses.length > 0 && (
                            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 border border-outline text-on-surface rounded-lg text-sm font-medium hover:bg-surface-dim transition-colors">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            )}
        </div>
    );
};

export default ShippingAddress;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hook/useAuth';
import { ContinueWithGoogle } from '../components/ContinueWithGoogle';

const Register = () => {
    const { handleRegister } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '', email: '', contactNumber: '', password: '', isSeller: false
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const validate = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Required';
        else if (formData.fullName.trim().length < 2) newErrors.fullName = 'Min 2 chars';
        if (!formData.email.trim()) newErrors.email = 'Required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
        if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Required';
        else if (!/^\+?[\d\s-]{7,15}$/.test(formData.contactNumber)) newErrors.contactNumber = 'Invalid number';
        if (!formData.password) newErrors.password = 'Required';
        else if (formData.password.length < 8) newErrors.password = 'Min 8 chars';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        if (!validate()) return;
        setIsSubmitting(true);
        try {
            await handleRegister({
                email: formData.email, contact: formData.contactNumber,
                password: formData.password, fullname: formData.fullName, isSeller: formData.isSeller
            });
            setSuccessMessage('Account created successfully!');
            setTimeout(() => navigate("/"), 1500);
        } catch (error) {
            setErrors({ submit: 'Failed to create account. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface-dim flex items-center justify-center relative font-sans text-on-surface selection:bg-primary/20 py-12">
            {/* Content Container */}
            <div className="w-full max-w-lg px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block group mb-4">
                        <span className="font-serif text-3xl font-bold tracking-wide text-primary flex items-center gap-2 justify-center">
                            CARTIQUE
                        </span>
                    </Link>
                    <h1 className="font-serif text-[40px] sm:text-5xl font-semibold mb-2 tracking-tight text-on-surface leading-tight">Create Account</h1>
                    <p className="text-secondary text-sm sm:text-base">Join us and experience the extraordinary</p>
                </div>

                {/* Card */}
                <div className="bg-white border border-outline rounded-2xl p-8 sm:p-10 shadow-sm relative overflow-hidden">
                    {/* Alerts */}
                    {successMessage && (
                        <div className="mb-6 p-4 rounded-xl bg-primary-fixed border border-primary-fixed-dim flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                            <span className="text-sm text-primary font-medium">{successMessage}</span>
                        </div>
                    )}
                    {errors.submit && (
                        <div className="mb-6 p-4 rounded-xl bg-error-container border border-error/20 flex items-center gap-3">
                            <span className="material-symbols-outlined text-error text-xl">error</span>
                            <span className="text-sm text-error font-medium">{errors.submit}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Full Name */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-secondary ml-1">Full Name</label>
                            <input
                                type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                                placeholder="Enter your full name"
                                className="w-full px-4 py-3 rounded-xl text-sm border border-outline bg-surface-bright focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-300 placeholder-tertiary"
                            />
                            {errors.fullName && <span className="text-[11px] text-error ml-1">{errors.fullName}</span>}
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-secondary ml-1">Email Address</label>
                            <input
                                type="email" name="email" value={formData.email} onChange={handleChange}
                                placeholder="name@example.com"
                                className="w-full px-4 py-3 rounded-xl text-sm border border-outline bg-surface-bright focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-300 placeholder-tertiary"
                            />
                            {errors.email && <span className="text-[11px] text-error ml-1">{errors.email}</span>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Contact Number */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-secondary ml-1">Contact Number</label>
                                <input
                                    type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange}
                                    placeholder="+1 (555) 000-0000"
                                    className="w-full px-4 py-3 rounded-xl text-sm border border-outline bg-surface-bright focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-300 placeholder-tertiary"
                                />
                                {errors.contactNumber && <span className="text-[11px] text-error ml-1">{errors.contactNumber}</span>}
                            </div>

                            {/* Password */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-secondary ml-1">Password</label>
                                <input
                                    type="password" name="password" value={formData.password} onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 rounded-xl text-sm border border-outline bg-surface-bright focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-300 placeholder-tertiary"
                                />
                                {errors.password && <span className="text-[11px] text-error ml-1">{errors.password}</span>}
                            </div>
                        </div>

                        {/* isSeller Checkbox */}
                        <div className="mt-2 ml-1">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center justify-center">
                                    <input
                                        type="checkbox" name="isSeller" checked={formData.isSeller} onChange={handleChange}
                                        className="peer sr-only"
                                    />
                                    <div className="w-5 h-5 bg-surface-bright border border-outline rounded-md peer-checked:bg-primary peer-checked:border-primary peer-focus:ring-2 peer-focus:ring-primary/30 transition-all duration-300 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[14px] text-white opacity-0 peer-checked:opacity-100 transition-opacity">check</span>
                                    </div>
                                </div>
                                <span className="text-sm font-medium text-secondary group-hover:text-on-surface transition-colors">
                                    Register as Seller
                                </span>
                            </label>
                        </div>

                        <ContinueWithGoogle />

                        {/* Submit Button */}
                        <button
                            type="submit" disabled={isSubmitting}
                            className="w-full mt-3 bg-primary hover:bg-primary-container text-white font-medium py-3 rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-secondary">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary hover:text-primary-container font-medium transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;

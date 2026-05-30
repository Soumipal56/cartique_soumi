import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hook/useAuth';
import { ContinueWithGoogle } from '../components/ContinueWithGoogle';
import Nav from '../../Shared/Components/Nav';

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
        <>
            <style dangerouslySetInnerHTML={{__html: `
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
                .font-outfit { font-family: 'Outfit', sans-serif; }
                .font-inter { font-family: 'Inter', sans-serif; }
                .glass-card {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .glass-input {
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                }
                .glass-input:focus {
                    background: rgba(0, 0, 0, 0.4);
                    border-color: #10b981;
                    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
                }
                @keyframes float {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-float-delayed { animation: float 8s ease-in-out 2s infinite; }
            `}} />
            
            <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden font-inter text-white selection:bg-[#10b981]/30 py-12">
                {/* Animated Background Orbs */}
                <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#10b981]/10 blur-[120px] animate-float"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-[#0ea5e9]/10 blur-[100px] animate-float-delayed"></div>
                
                {/* Content Container */}
                <div className="w-full max-w-lg px-6 relative z-10">
                    
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Nav />
                        <h1 className="font-outfit text-4xl sm:text-5xl font-semibold mb-2 tracking-tight">Create Account</h1>
                        <p className="text-gray-400 text-sm sm:text-base">Join us and experience the extraordinary</p>
                    </div>

                    {/* Glassmorphism Card */}
                    <div className="glass-card rounded-[2rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden">
                        
                        {/* Decorative Top Line */}
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#10b981] to-transparent opacity-50"></div>

                        {/* Alerts */}
                        {successMessage && (
                            <div className="mb-6 p-4 rounded-xl bg-[#10b981]/10 border border-[#10b981]/20 flex items-center gap-3 animate-fade-in">
                                <svg className="w-5 h-5 text-[#10b981] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-sm text-[#10b981] font-medium">{successMessage}</span>
                            </div>
                        )}
                        {errors.submit && (
                            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 animate-fade-in">
                                <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span className="text-sm text-red-400 font-medium">{errors.submit}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {/* Full Name */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-gray-300 ml-1">Full Name</label>
                                <input
                                    type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                                    placeholder="Enter your full name"
                                    className="glass-input w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 placeholder-gray-500"
                                />
                                {errors.fullName && <span className="text-[11px] text-red-400 ml-1">{errors.fullName}</span>}
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-gray-300 ml-1">Email Address</label>
                                <input
                                    type="email" name="email" value={formData.email} onChange={handleChange}
                                    placeholder="name@example.com"
                                    className="glass-input w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 placeholder-gray-500"
                                />
                                {errors.email && <span className="text-[11px] text-red-400 ml-1">{errors.email}</span>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Contact Number */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium text-gray-300 ml-1">Contact Number</label>
                                    <input
                                        type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange}
                                        placeholder="+1 (555) 000-0000"
                                        className="glass-input w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 placeholder-gray-500"
                                    />
                                    {errors.contactNumber && <span className="text-[11px] text-red-400 ml-1">{errors.contactNumber}</span>}
                                </div>

                                {/* Password */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium text-gray-300 ml-1">Password</label>
                                    <input
                                        type="password" name="password" value={formData.password} onChange={handleChange}
                                        placeholder="••••••••"
                                        className="glass-input w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 placeholder-gray-500"
                                    />
                                    {errors.password && <span className="text-[11px] text-red-400 ml-1">{errors.password}</span>}
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
                                        <div className="w-5 h-5 bg-black/20 border border-white/20 rounded-md peer-checked:bg-[#10b981] peer-checked:border-[#10b981] peer-focus:ring-2 peer-focus:ring-[#10b981]/30 transition-all duration-300 flex items-center justify-center group-hover:border-white/40 shadow-inner">
                                            <svg className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                                        Register as Seller
                                    </span>
                                </label>
                            </div>

                            <ContinueWithGoogle />

                            {/* Submit Button */}
                            <button
                                type="submit" disabled={isSubmitting}
                                className="w-full mt-3 bg-[#10b981] hover:bg-[#0ea5e9] text-gray-900 font-semibold py-3.5 rounded-xl transition-all duration-500 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(14,165,233,0.4)] disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Account...
                                    </span>
                                ) : 'Create Account'}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-400">
                                Already have an account?{' '}
                                <Link to="/login" className="text-[#10b981] hover:text-white font-medium transition-colors">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;

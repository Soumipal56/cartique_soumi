import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hook/useAuth';
import ContinueWithGoogle from '../components/ContinueWithGoogle';

const Login = () => {
    const { handleLogin } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const validate = () => {
        const newErrors = {};
        if (!formData.email.trim()) newErrors.email = 'Required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
        if (!formData.password) newErrors.password = 'Required';
        else if (formData.password.length < 8) newErrors.password = 'Min 8 chars';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        if (!validate()) return;
        setIsSubmitting(true);
        try {
            const user = await handleLogin({ email: formData.email, password: formData.password });
            setSuccessMessage('Logged in successfully!');
            if(user.role === "seller"){
                navigate("/seller/dashboard")
            } else {
                navigate("/")
            }
        } catch (error) {
            setErrors({ submit: 'Failed to login. Please check credentials.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface-dim flex items-center justify-center relative font-sans text-on-surface selection:bg-primary/20">
            {/* Content Container */}
            <div className="w-full max-w-md px-6 py-12 relative z-10">
                {/* Header */}
                <div className="text-center mb-10">
                    <Link to="/" className="inline-block group mb-6">
                        <span className="font-serif text-3xl font-bold tracking-wide text-primary flex items-center gap-2 justify-center">
                            CARTIQUE
                        </span>
                    </Link>
                    <h1 className="font-serif text-[40px] sm:text-5xl font-semibold mb-3 tracking-tight text-on-surface leading-tight">Welcome Back</h1>
                    <p className="text-secondary text-sm sm:text-base">Enter your credentials to access your account</p>
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

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

                        {/* Password */}
                        <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-medium text-secondary">Password</label>
                                <Link to="#" className="text-[11px] text-primary hover:text-primary-container transition-colors">Forgot?</Link>
                            </div>
                            <input
                                type="password" name="password" value={formData.password} onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl text-sm border border-outline bg-surface-bright focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-300 placeholder-tertiary"
                            />
                            {errors.password && <span className="text-[11px] text-error ml-1">{errors.password}</span>}
                        </div>

                        <ContinueWithGoogle />

                        {/* Submit Button */}
                        <button
                            type="submit" disabled={isSubmitting}
                            className="w-full mt-2 bg-primary hover:bg-primary-container text-white font-medium py-3 rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-secondary">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary hover:text-primary-container font-medium transition-colors">
                                Create one
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

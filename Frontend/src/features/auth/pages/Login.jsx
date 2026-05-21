import React, { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../hook/useAuth';
import { useNavigate } from 'react-router';
import ContinueWithGoogle from '../components/ContinueWithGoogle';

const Login = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }

    if (!formData.password) {
      newErrors.password = 'Required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Min 8 chars';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await handleLogin({
        email: formData.email,
        password: formData.password
      });
      setSuccessMessage('Logged in successfully! Redirecting...');
      
      // Navigate to home page after a brief delay to show success message
      setTimeout(() => {
        navigate("/");
      }, 1500);
      
    } catch (error) {
      setErrors({ submit: 'Failed to login. Please check your credentials and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#131313] text-[#e5e2e1] flex flex-col justify-between font-['Inter'] selection:bg-[#10b981]/20 selection:text-[#34d399] overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="w-full px-8 lg:px-16 py-3 flex items-center justify-between border-b border-[#1e1e1e]/80 backdrop-blur-md flex-shrink-0 z-50">
        <Link to="/" className="font-['Hanken_Grotesk'] text-xl font-bold tracking-tight text-white flex items-center gap-2 group">
          Cartique
          <span className="w-2 h-2 rounded-full bg-[#10b981] group-hover:shadow-[0_0_12px_#10b981] transition-shadow duration-300"></span>
        </Link>
        <div className="flex items-center gap-6">
          <a href="#help" className="flex items-center gap-1.5 text-xs font-medium text-[#d3c5ac] hover:text-[#34d399] transition-colors">
            <span className="material-symbols-outlined text-sm">help_outline</span>
            Need Help?
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-2 overflow-hidden relative w-full">
        {/* Snake moving radial gradient backdrop */}
        <div className="absolute w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] rounded-full bg-gradient-to-r from-[#10b981] via-[#34d399] to-[#059669] opacity-30 blur-[80px] pointer-events-none animate-snake z-0"></div>

        {/* Floating Real Images Throughout the Screen */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 hidden md:block">
          {/* Top Left Floating Image */}
          <div className="absolute top-12 left-12 p-2 bg-[#1e1e1e]/80 backdrop-blur-md rounded-xl border border-[#2d2d2d] shadow-2xl -rotate-6 hover:rotate-0 transition-transform duration-500 animate-pulse">
            <img src="/pink_baby_cloth.png" alt="Baby Cloth" className="w-36 h-36 object-cover rounded-lg border border-[#3a3a3a]" />
          </div>
          {/* Bottom Left Floating Image */}
          <div className="absolute bottom-16 left-20 p-2 bg-[#1e1e1e]/80 backdrop-blur-md rounded-xl border border-[#2d2d2d] shadow-2xl rotate-12 hover:rotate-0 transition-transform duration-500">
            <img src="/baby_clothes_collection.png" alt="Baby Collection" className="w-40 h-40 object-cover rounded-lg border border-[#3a3a3a]" />
          </div>
          {/* Top Right Floating Image */}
          <div className="absolute top-16 right-16 p-2 bg-[#1e1e1e]/80 backdrop-blur-md rounded-xl border border-[#2d2d2d] shadow-2xl rotate-6 hover:rotate-0 transition-transform duration-500">
            <img src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&h=300&fit=crop&auto=format&q=80" alt="Baby Clothes Rack" className="w-36 h-36 object-cover rounded-lg border border-[#3a3a3a]" />
          </div>
          {/* Bottom Right Floating Image */}
          <div className="absolute bottom-12 right-12 p-2 bg-[#1e1e1e]/80 backdrop-blur-md rounded-xl border border-[#2d2d2d] shadow-2xl -rotate-12 hover:rotate-0 transition-transform duration-500 animate-pulse">
            <img src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=300&h=300&fit=crop&auto=format&q=80" alt="Baby Nursery" className="w-40 h-40 object-cover rounded-lg border border-[#3a3a3a]" />
          </div>
        </div>

        <div className="w-full max-w-[440px] bg-[#1e1e1e]/90 backdrop-blur-xl rounded-2xl p-6 sm:p-7 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.7)] border border-[#2d2d2d]/80 relative flex flex-col max-h-[calc(100vh-90px)] my-auto z-10">
          {/* Top subtle emerald line indicator */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#10b981] to-transparent opacity-80"></div>

          {/* Header Section */}
          <div className="mb-4 flex-shrink-0">
            <h1 className="font-['Hanken_Grotesk'] text-2xl font-semibold text-white tracking-tight mb-1">
              Welcome Back
            </h1>
            <p className="text-[11px] sm:text-xs text-[#d3c5ac] font-normal leading-relaxed">
              Login to continue your elite custom shopping experience.
            </p>
          </div>

          {/* Success Alert */}
          {successMessage && (
            <div className="mb-4 p-3 bg-[#10b981]/10 border border-[#10b981]/30 rounded-xl flex items-start gap-2.5 animate-fadeIn flex-shrink-0">
              <span className="material-symbols-outlined text-[#34d399] text-base mt-0.5">check_circle</span>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#34d399]">Success</span>
                <span className="text-[11px] text-[#d3c5ac] mt-0.5 leading-relaxed">{successMessage}</span>
              </div>
            </div>
          )}

          {/* Submit Error Alert */}
          {errors.submit && (
            <div className="mb-4 p-3 bg-[#93000a]/20 border border-[#ffb4ab]/30 rounded-xl flex items-start gap-2.5 animate-fadeIn flex-shrink-0">
              <span className="material-symbols-outlined text-[#ffb4ab] text-base mt-0.5">error</span>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#ffb4ab]">Login Error</span>
                <span className="text-[11px] text-[#ffdad6] mt-0.5 leading-relaxed">{errors.submit}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
            {/* Email Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="email" className="font-['Inter'] text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-[#d3c5ac]">
                  Email Address
                </label>
                {errors.email && (
                  <span className="text-[10px] text-[#ffb4ab] flex items-center gap-0.5 animate-fadeIn">
                    <span className="material-symbols-outlined text-[11px]">warning</span>
                    {errors.email}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className={`w-full bg-[#131313] text-[#e5e2e1] text-xs sm:text-sm px-3 py-2 rounded-lg border-b ${
                    errors.email ? 'border-[#ffb4ab] focus:ring-[#ffb4ab]/20' : 'border-[#2d2d2d] focus:border-[#10b981] focus:ring-[#10b981]/20'
                  } focus:ring-1 focus:outline-none transition-all duration-200 placeholder-[#474746] shadow-inner`}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="font-['Inter'] text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-[#d3c5ac]">
                  Password
                </label>
                {errors.password ? (
                  <span className="text-[10px] text-[#ffb4ab] flex items-center gap-0.5 animate-fadeIn">
                    <span className="material-symbols-outlined text-[11px]">warning</span>
                    {errors.password}
                  </span>
                ) : (
                  <span className="text-[10px] text-[#b7b5b4]">Min 8 chars</span>
                )}
              </div>


              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full bg-[#131313] text-[#e5e2e1] text-xs sm:text-sm pl-3 pr-9 py-2 rounded-lg border-b ${
                    errors.password ? 'border-[#ffb4ab] focus:ring-[#ffb4ab]/20' : 'border-[#2d2d2d] focus:border-[#10b981] focus:ring-[#10b981]/20'
                  } focus:ring-1 focus:outline-none transition-all duration-200 placeholder-[#474746] shadow-inner`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#b7b5b4] hover:text-[#34d399] transition-colors flex items-center justify-center p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined text-base">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <ContinueWithGoogle/>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#10b981] hover:bg-[#34d399] active:bg-[#059669] text-[#002919] font-['Inter'] font-semibold text-xs sm:text-sm py-2.5 px-6 rounded-lg transition-all duration-200 shadow-[0_8px_16px_-4px_rgba(16,185,129,0.25)] hover:shadow-[0_12px_20px_-4px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-[#002919] border-t-transparent rounded-full animate-spin"></span>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <span className="material-symbols-outlined text-sm sm:text-base">arrow_forward</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer / Bottom Navigation */}
      <footer className="w-full px-8 lg:px-16 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-[#1e1e1e]/80 text-[11px] text-[#b7b5b4] gap-2 backdrop-blur-md flex-shrink-0">
        <p>© 2026 Cartique. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="#privacy" className="hover:text-[#34d399] transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-[#34d399] transition-colors">Terms of Service</a>
          <Link to="/register" className="hover:text-[#34d399] transition-colors flex items-center gap-1.5 text-[#d3c5ac] font-medium">
            <span className="material-symbols-outlined text-xs">person_add</span>
            <span>Don't have an account? Register</span>
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Login;

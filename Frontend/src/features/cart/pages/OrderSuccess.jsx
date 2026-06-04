import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const OrderSuccess = () => {
    const location = useLocation()
    const navigate = useNavigate()
    
    const queryParams = new URLSearchParams(location.search)
    const orderId = queryParams.get("order_id")
    
  return (
    <div className="min-h-screen bg-surface-dim font-sans text-on-surface pb-24 relative overflow-hidden">
      <style>{`
        .success-checkmark {
            animation: check-scale 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes check-scale {
            0% { transform: scale(0); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }
        .shimmer-effect {
            background: linear-gradient(90deg, transparent, rgba(234, 179, 8, 0.1), transparent);
            background-size: 200% 100%;
            animation: shimmer 3s infinite;
        }
        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
      `}</style>
      
      <main className="flex flex-col items-center justify-center min-h-screen px-6 pt-16 pb-24 max-w-[480px] mx-auto overflow-hidden">
        {/* Success Animation & Hero */}
        <div className="relative flex flex-col items-center text-center mb-10">
          <div className="success-checkmark w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-8 shadow-sm">
            <span className="material-symbols-outlined text-[48px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <h2 className="font-serif text-[32px] font-semibold text-on-surface mb-2 tracking-tight">Order Placed Successfully!</h2>
          <p className="text-secondary max-w-[300px]">Thank you for your purchase. Your order is being processed.</p>
        </div>

        {/* Order Summary Card */}
        <div className="w-full bg-white rounded-2xl p-6 mb-12 shadow-sm border border-outline relative overflow-hidden">
          <div className="absolute inset-0 shimmer-effect pointer-events-none opacity-30"></div>
          <div className="flex flex-col gap-6 relative z-10">
            <div className="flex justify-between items-center border-b border-outline pb-4">
              <span className="text-sm text-secondary uppercase tracking-widest">Order ID</span>
              <span className="font-bold text-on-surface">#{orderId || "N/A"}</span>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-surface-dim p-3 rounded-xl border border-outline">
                <span className="material-symbols-outlined text-primary">local_shipping</span>
              </div>
              <div>
                <p className="text-sm text-secondary">Estimated Delivery</p>
                <p className="font-semibold text-on-surface">3-5 business days</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-surface-dim p-3 rounded-xl border border-outline">
                <span className="material-symbols-outlined text-primary">package_2</span>
              </div>
              <div>
                <p className="text-sm text-secondary">Shipping Status</p>
                <p className="font-semibold text-on-surface">Awaiting Pickup</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full space-y-4">
          <button 
            onClick={() => navigate('/')}
            className="w-full py-4 px-6 bg-primary text-white font-medium text-[18px] rounded-xl transition-transform active:scale-95 hover:opacity-90 shadow-sm"
          >
            Continue Shopping
          </button>
          <button 
            onClick={() => navigate('/profile')}
            className="w-full py-4 px-6 bg-transparent border border-outline text-on-surface font-medium rounded-xl transition-all hover:bg-surface-dim active:scale-95"
          >
            View Order History
          </button>
        </div>

        {/* Visual Embellishment */}
        <div className="fixed top-[20%] -right-24 w-64 h-64 bg-primary/10 blur-[120px] -z-10 rounded-full pointer-events-none"></div>
        <div className="fixed bottom-[10%] -left-24 w-48 h-48 bg-primary/20 blur-[100px] -z-10 rounded-full pointer-events-none"></div>
      </main>
    </div>
  )
}

export default OrderSuccess
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const PaymentFailed = () => {
    const location = useLocation()
    const navigate = useNavigate()
    
    const queryParams = new URLSearchParams(location.search)
    const errorReason = queryParams.get("reason") || "Payment was cancelled or an error occurred during processing."
    
  return (
    <div className="min-h-screen bg-surface-dim font-sans text-on-surface pb-24 relative overflow-hidden">
      <style>{`
        .error-cross {
            animation: cross-scale 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes cross-scale {
            0% { transform: scale(0); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      
      <main className="flex flex-col items-center justify-center min-h-screen px-6 pt-16 pb-24 max-w-[480px] mx-auto overflow-hidden">
        {/* Error Animation & Hero */}
        <div className="relative flex flex-col items-center text-center mb-10 z-10">
          <div className="error-cross w-24 h-24 bg-error rounded-full flex items-center justify-center mb-8 shadow-sm">
            <span className="material-symbols-outlined text-[48px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
          </div>
          <h2 className="font-serif text-[32px] font-semibold text-on-surface mb-2 tracking-tight">Payment Failed!</h2>
          <p className="text-secondary max-w-[300px]">{errorReason}</p>
        </div>

        {/* Suggestion Card */}
        <div className="w-full bg-white rounded-2xl p-6 mb-12 shadow-sm border border-error/20 relative z-10">
          <div className="flex flex-col gap-4">
            <h3 className="font-medium text-on-surface">What can you do?</h3>
            <ul className="text-sm text-secondary space-y-2 list-disc pl-5">
              <li>Check your internet connection and try again.</li>
              <li>Ensure you have sufficient funds in your account.</li>
              <li>Contact your bank if the issue persists.</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full space-y-4 z-10">
          <button 
            onClick={() => navigate('/cart')}
            className="w-full py-4 px-6 bg-error text-white font-medium text-[18px] rounded-xl transition-transform active:scale-95 hover:opacity-90 shadow-sm"
          >
            Try Again
          </button>
          <button 
            onClick={() => navigate('/')}
            className="w-full py-4 px-6 bg-transparent border border-outline text-on-surface font-medium rounded-xl transition-all hover:bg-surface-dim active:scale-95"
          >
            Return to Home
          </button>
        </div>

        {/* Visual Embellishment */}
        <div className="fixed top-[20%] -right-24 w-64 h-64 bg-error/10 blur-[120px] -z-10 rounded-full pointer-events-none"></div>
        <div className="fixed bottom-[10%] -left-24 w-48 h-48 bg-error/20 blur-[100px] -z-10 rounded-full pointer-events-none"></div>
      </main>
    </div>
  )
}

export default PaymentFailed

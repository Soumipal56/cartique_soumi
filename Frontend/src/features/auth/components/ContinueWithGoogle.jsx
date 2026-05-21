import React from 'react';

// Simple Google Sign‑In button that redirects to backend OAuth flow.
// No client ID required on the frontend.
export const ContinueWithGoogle = () => (
  <a
    href="/api/auth/google"
    className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-white text-sm font-medium text-[#202124] border border-[#dadce0] shadow-sm hover:bg-[#f8f9fa] transition-colors"
  >
    {/* Google "G" logo */}
    <svg
      className="w-5 h-5"
      viewBox="0 0 533.5 544.3"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M533.5 278.4c0-17.9-1.6-35.2-4.6-52H272v98.5h146.9c-6.3 34.1-25.4 63-54 82.3v68.2h87.2c51.1-47.1 80.4-116.5 80.4-196.9z"
        fill="#4285F4"
      />
      <path
        d="M272 544.3c73 0 134.3-24.2 179.1-66.1l-87.2-68.2c-24.2 16.3-55 25.9-91.9 25.9-70.7 0-130.6-47.7-152-111.7h-89.5v70.1c44.5 88.1 136.4 150.9 241.5 150.9z"
        fill="#34A853"
      />
      <path
        d="M120 324.2c-10.2-30.4-10.2-63 0-93.4V160.7h-89.5c-39.5 78.9-39.5 170.5 0 249.3L120 324.2z"
        fill="#FBBC05"
      />
      <path
        d="M272 107.7c39.5-.6 77.6 14.6 106.4 42.5l79.5-79.5C410.2 24.2 342.8-.1 272 0 166.9 0 75 62.8 30.5 150.9l89.5 70.1C141.4 155.4 201.3 107.7 272 107.7z"
        fill="#EA4335"
      />
    </svg>
    Continue with Google
  </a>
);

export default ContinueWithGoogle;
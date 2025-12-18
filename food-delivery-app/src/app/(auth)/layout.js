'use client'

import React from 'react';

export default function AuthLayout({ children }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-[400px] p-4">
        {children}
      </div>
    </div>
  );
}
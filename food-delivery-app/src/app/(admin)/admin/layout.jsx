'use client'

import React from 'react';

export default function AdminRootLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* İleride buraya Admin'e özel Toast (Bildirim) bileşenleri eklenebilir */}
      {children}
    </div>
  );
}
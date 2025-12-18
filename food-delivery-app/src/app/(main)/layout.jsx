import React from 'react';
// Düzeltme: '@' alias'ı yerine göreceli dosya yolları kullanıyoruz
// app/(main)/layout.jsx konumundan iki üst klasöre çıkıp components'e ulaşıyoruz
import BottomNav from '@/components/layout/BottomNav';
import Header from '@/components/layout/Header';

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Üst Kısım: Header */}
      <Header />

      {/* Orta Kısım: Değişen Sayfa İçeriği */}
      {/* pb-24: BottomNav'ın altında içerik kalmasın diye padding veriyoruz */}
      <main className="flex-grow pb-24">
        {children}
      </main>

      {/* Alt Kısım: Navigasyon */}
      <BottomNav />
    </div>
  );
}
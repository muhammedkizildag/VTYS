'use client'

import React, { use } from 'react';
import { LayoutDashboard, Utensils, ShoppingBag, Settings, Store, ArrowRight } from 'lucide-react';

// NOT: Sidebar bileşeni, dosya yolu hatası almamak için buraya dahil edilmiştir.
// Gerçek projede bunu components/admin/Sidebar.jsx olarak ayırabilirsiniz.

function Sidebar({ restaurantId }) {
  // Aktif link kontrolü (Preview ortamı için)
  const isActive = (path) => {
    if (typeof window !== 'undefined') {
        return window.location.pathname.includes(path);
    }
    return false;
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Özet', path: `/admin/${restaurantId}/dashboard` },
    { icon: Utensils, label: 'Menü Yönetimi', path: `/admin/${restaurantId}/menu` },
    { icon: ShoppingBag, label: 'Siparişler', path: `/admin/${restaurantId}/orders` },
    { icon: Settings, label: 'Ayarlar', path: `/admin/${restaurantId}/settings` },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0 flex flex-col z-50">
      
      {/* Logo Alanı */}
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
            <Store size={18} />
        </div>
        <span className="font-bold text-lg">Panel</span>
      </div>

      {/* Menü Linkleri */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
            <button
                key={item.path}
                // [NEXT.JS]: <Link href={item.path}>...</Link>
                onClick={() => window.location.href = item.path}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path) 
                    ? 'bg-black text-white' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                }`}
            >
                <item.icon size={20} strokeWidth={2} />
                {item.label}
            </button>
        ))}
      </nav>

      {/* Alt Kısım */}
      <div className="p-4 border-t border-gray-100">
        <button 
            onClick={() => window.location.href = '/admin/restaurants'}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-black transition-colors"
        >
            <ArrowRight size={20} className="rotate-180" />
            <span className="text-sm font-medium">Restoran Değiştir</span>
        </button>
      </div>
    </aside>
  );
}

export default function RestaurantAdminLayout({ children, params }) {
  // Next.js App Router'da 'params' prop olarak gelir.
  // [ÖNİZLEME İÇİN]: params prop'unu simüle ediyoruz.
  params = use(params);
  const restaurantId = params.restaurantId; 

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar restaurantId={restaurantId} />

      {/* Ana İçerik Alanı */}
      {/* Sidebar genişliği (w-64) kadar soldan boşluk bırakıyoruz (pl-64) */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-5xl mx-auto">
            {children}
        </div>
      </main>
    </div>
  );
}
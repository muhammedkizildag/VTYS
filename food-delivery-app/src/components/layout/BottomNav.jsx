'use client'

import React from 'react';
import { Home, Search, ShoppingBag, User } from 'lucide-react';
import Link from 'next/link'; // DEĞİŞİKLİK 1: Link eklendi
import { usePathname } from 'next/navigation'; // DEĞİŞİKLİK 2: usePathname eklendi
  
export default function BottomNav() {
  const pathname = usePathname(); // DEĞİŞİKLİK 3: Aktif URL'i alıyoruz

  // Helper: Eğer pathname '/search' ise ve biz '/search' linkindeysek ikon siyah olur
  const isActive = (path) => pathname === path ? 'text-black' : 'text-gray-400 hover:text-black';

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 pb-safe z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between max-w-md mx-auto">
        
        {/* DEĞİŞİKLİK 4: button yerine Link, onClick yerine href */}
        <Link href="/" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/')}`}>
          <Home size={24} strokeWidth={pathname === '/' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Anasayfa</span>
        </Link>

        <Link href="/search" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/search')}`}>
          <Search size={24} strokeWidth={pathname === '/search' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Ara</span>
        </Link>

        <Link href="/cart" className={`relative flex flex-col items-center gap-1 transition-colors ${isActive('/cart')}`}>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[10px] flex items-center justify-center rounded-full">
            2
          </div>
          <ShoppingBag size={24} strokeWidth={pathname === '/cart' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Sepetim</span>
        </Link>

        <Link href="/profile" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/profile')}`}>
          <User size={24} strokeWidth={pathname === '/profile' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Profil</span>
        </Link>

      </div>
    </nav>
  );
}
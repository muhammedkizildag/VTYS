'use client'

import React, { useEffect, useState } from 'react';
import { User, Settings, MapPin, Heart, Clock, CreditCard, LogOut, ChevronRight, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [name, setName] = useState(' ');
  const [email, setEmail] = useState(' ');
  const [orders, setOrders] = useState([]);
  const router = useRouter()

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/profile`, {
      method: 'GET',
      credentials: 'include'
    }).then(async r => {
      const data = await r.json();
      console.log((data));

      setName(data.name);
      setEmail(data.email);
      setOrders(data.orders);
    
    });
  }, []);

  const handleLogout = async () => {

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      })
      console.log(res)
      router.push('/login')
    }
    catch (e) {
      console.log(e);
    }

  }

  // Yönlendirme Fonksiyonu (Next.js Router yerine window.location kullanıyoruz preview için)


  // Menü Öğesi Bileşeni - onClick prop'u eklendi
  const MenuItem = ({ icon: Icon, title, subtitle, onClick }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
    >
      <div className="flex items-center gap-4">
        <div className="bg-gray-50 p-2.5 rounded-full text-black">
          <Icon size={20} strokeWidth={2} />
        </div>
        <div className="text-left">
          <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <ChevronRight size={16} className="text-gray-300" />
    </button>
  );

  return (
    <div className="bg-white min-h-screen pb-24 font-sans">

      {/* Profil Başlığı */}
      <div className="px-6 pt-10 pb-6 bg-white">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
            <User size={32} className="text-gray-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-black">{name}</h1>
            <p className="text-gray-500 text-sm">{email}</p>
            <div className="mt-2 flex gap-2">
              <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full">GOLD ÜYE</span>
            </div>
          </div>
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
            <span className="block text-2xl font-bold text-black">{orders.length}</span>
            <span className="text-xs text-gray-500 font-medium">Toplam Sipariş</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
            <span className="block text-2xl font-bold text-black">12</span>
            <span className="text-xs text-gray-500 font-medium">Favori Restoran</span>
          </div>
        </div>
      </div>

      <hr className="h-2 bg-gray-50 border-none" />

      {/* Menü Listesi */}
      <div className="bg-white">
        <div className="px-6 py-4">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Hesabım</h2>
        </div>

        {/* Linkler Eklendi */}
        <MenuItem
          icon={Clock}
          title="Geçmiş Siparişlerim"
          subtitle="Son sipariş: Burger Lab"
          onClick={() => navigateTo('/profile/orders')}
        />
        <MenuItem
          icon={Heart}
          title="Favorilerim"
          subtitle="12 restoran"
          onClick={() => navigateTo('/profile/favorites')}
        />

        {/* Henüz yapılmayan sayfalar için placeholder */}
        <MenuItem
          icon={MapPin}
          title="Adreslerim"
          subtitle="Ev, İş"
          onClick={() => router.push('profile/addresses')}
        />
        <MenuItem
          icon={CreditCard}
          title="Ödeme Yöntemleri"
          subtitle="Mastercard **** 4242"
          onClick={() => alert('Ödeme yöntemleri sayfası henüz eklenmedi.')}
        />

        <div className="h-2 bg-gray-50 border-none mt-2"></div>

        <div className="px-6 py-4">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Uygulama Ayarları</h2>
        </div>

        <MenuItem
          icon={Settings}
          title="Hesap Ayarları"
          onClick={() => alert('Ayarlar sayfası henüz eklenmedi.')}
        />
        <MenuItem
          icon={HelpCircle}
          title="Yardım ve Destek"
          onClick={() => alert('Yardım sayfası henüz eklenmedi.')}
        />

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 p-4 px-6 mt-2 text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-semibold text-sm">Çıkış Yap</span>
        </button>
      </div>

    </div>
  );
}
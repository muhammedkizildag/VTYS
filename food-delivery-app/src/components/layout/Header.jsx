'use client'

import { MapPin, User, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Header() {

  const [selectedAddress, setSelectedAddress] = useState('');

  useEffect(() => {

    (async () => {

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/selected-address`, {
          method: 'GET',
          credentials: 'include'
        });

        const add = (await res.json())[0]
        console.log(add)
        setSelectedAddress(add);  
      }
      catch (e) {
      }

    })();

  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Sol Taraf: Konum Bilgisi */}
        <div className="cursor-pointer hover:opacity-80 transition-opacity">
          <p className="text-[11px] text-gray-500 flex items-center gap-0.5 font-medium uppercase tracking-wide">
            Teslimat Adresi <ChevronRight size={12} />
          </p>
          <h1 className="text-sm md:text-base font-bold flex items-center gap-1.5 text-black mt-0.5">
            <MapPin size={16} className="text-black fill-current" />
            <span className="line-clamp-1">{`${selectedAddress ? selectedAddress.title:''}, ${selectedAddress ? selectedAddress.district:''}, ${selectedAddress ? selectedAddress.city:''}`}</span>
          </h1>
        </div>

        {/* Sağ Taraf: Profil Butonu */}
        <button className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">
          <User size={20} className="text-gray-700" />
        </button>
      </div>
    </header>
  );
}
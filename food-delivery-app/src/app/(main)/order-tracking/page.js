'use client'

import React from 'react';
import { ChevronLeft, Phone, MessageSquare, MapPin, Check } from 'lucide-react';

export default function OrderTrackingPage() {
  
  // Örnek Sipariş Durumu
  const currentStep = 2; // 0: Alındı, 1: Hazırlanıyor, 2: Yolda, 3: Teslim Edildi
  
  const steps = [
    { title: "Sipariş Alındı", time: "14:30" },
    { title: "Hazırlanıyor", time: "14:35" },
    { title: "Kurye Yolda", time: "14:50" },
    { title: "Teslim Edildi", time: "-" },
  ];

  return (
    <div className="bg-white min-h-screen font-sans flex flex-col">
      
      {/* Harita Alanı (Arkaplan) */}
      <div className="relative flex-1 bg-gray-200 w-full min-h-[40vh]">
        {/* Placeholder Harita Görseli */}
        <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1000&q=80" 
            alt="Map" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        
        {/* Üst Navigasyon (Harita Üzerinde) */}
        <div className="absolute top-4 left-4 z-10">
            <button 
                onClick={() => window.location.href = '/profile'} // router.back()
                className="p-3 bg-white shadow-md rounded-full text-black hover:bg-gray-50"
            >
                <ChevronLeft size={24} />
            </button>
        </div>

        {/* Kurye İkonu (Harita Üzerinde Hareketli Gibi) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black text-white p-3 rounded-full shadow-xl border-2 border-white animate-bounce">
            <div className="w-6 h-6 flex items-center justify-center">🛵</div>
        </div>
      </div>

      {/* Alt Bilgi Paneli (Bottom Sheet Görünümlü) */}
      <div className="bg-white rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.1)] -mt-6 relative z-10 p-6 pb-safe">
        
        {/* Kulp (Handle) */}
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>

        {/* Tahmini Süre */}
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-black">10-15 dk</h2>
            <p className="text-gray-500 text-sm mt-1">Tahmini teslimat süresi</p>
        </div>

        {/* Durum Çubuğu (Stepper) */}
        <div className="flex justify-between items-center mb-8 px-2 relative">
            {/* Arka Plan Çizgisi */}
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-100 -z-10"></div>
            
            {/* İlerleme Çizgisi */}
            <div 
                className="absolute left-0 top-1/2 h-0.5 bg-green-500 -z-10 transition-all duration-500"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            ></div>

            {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center gap-2 bg-white px-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                        index <= currentStep 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'bg-white border-gray-200 text-gray-300'
                    }`}>
                        {index <= currentStep ? <Check size={14} strokeWidth={3} /> : <div className="w-2 h-2 bg-gray-200 rounded-full" />}
                    </div>
                    {/* Sadece aktif veya tamamlanmış adımların metnini gösterelim, kalabalık olmasın */}
                    {index === currentStep && (
                        <span className="absolute -bottom-6 text-xs font-bold text-black whitespace-nowrap animate-in fade-in slide-in-from-top-1">
                            {step.title}
                        </span>
                    )}
                </div>
            ))}
        </div>

        <div className="h-6"></div> {/* Boşluk */}

        {/* Kurye Bilgileri */}
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-full overflow-hidden border border-gray-200">
                    <img src="https://i.pravatar.cc/150?img=11" alt="Kurye" className="w-full h-full object-cover" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 text-sm">Mehmet K.</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        <span className="text-yellow-500">★ 4.9</span> • Kurye
                    </p>
                </div>
            </div>
            <div className="flex gap-2">
                <button className="p-2.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:text-black hover:border-black transition-colors">
                    <MessageSquare size={20} />
                </button>
                <button className="p-2.5 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
                    <Phone size={20} />
                </button>
            </div>
        </div>

        {/* Adres Özeti */}
        <div className="mt-6 flex items-start gap-3 px-2">
            <MapPin size={20} className="text-gray-400 mt-1" />
            <div>
                <h4 className="font-bold text-sm text-gray-900">Teslimat Adresi</h4>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    Caferağa Mah. Moda Cad. No: 12/4 Kadıköy
                </p>
            </div>
        </div>

      </div>
    </div>
  );
}
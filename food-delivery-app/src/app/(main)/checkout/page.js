'use client'

import React, { useState } from 'react';
import { MapPin, CreditCard, Wallet, ChevronRight, CheckCircle, ArrowLeft } from 'lucide-react';
// import Link from 'next/link'; // Gerçek projede import edin

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isOrderComplete, setIsOrderComplete] = useState(false);

  // Sipariş Tamamlandı Ekranı
  if (isOrderComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6 text-center animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="text-green-500 w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-black mb-2">Siparişin Alındı!</h2>
        <p className="text-gray-500 mb-8 max-w-xs mx-auto">
          Lezzetli yemeğin hazırlanmaya başladı. Sipariş durumunu profilinden takip edebilirsin.
        </p>
        
        {/* Link href="/" */}
        <button 
            onClick={() => window.location.href = '/'} 
            className="w-full max-w-xs bg-black text-white py-3.5 rounded-full font-bold hover:bg-gray-800 transition-colors"
        >
          Anasayfaya Dön
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-40 font-sans">
      
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100 flex items-center sticky top-0 z-10">
        {/* Link href="/cart" */}
        <button className="mr-4 p-1 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={20} className="text-black" />
        </button>
        <h1 className="text-lg font-bold text-black">Ödeme</h1>
      </div>

      <div className="max-w-screen-md mx-auto p-4 space-y-6">
        
        {/* Adres Bölümü */}
        <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Teslimat Adresi</h2>
            <button className="text-xs font-semibold text-black underline">Değiştir</button>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-black/5 p-2 rounded-full mt-1">
                <MapPin size={20} className="text-black" />
            </div>
            <div>
                <h3 className="font-bold text-gray-900">Ev</h3>
                <p className="text-sm text-gray-500 leading-relaxed mt-0.5">
                    Caferağa Mah. Moda Cad. No: 12/4 <br />
                    Kadıköy / İstanbul
                </p>
            </div>
          </div>
        </section>

        {/* Ödeme Yöntemi */}
        <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Ödeme Yöntemi</h2>
          
          <div className="space-y-3">
            {/* Kredi Kartı Seçeneği */}
            <label 
                className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                    paymentMethod === 'card' ? 'border-black bg-black/5' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('card')}
            >
                <div className="flex items-center gap-3">
                    <CreditCard size={20} className={paymentMethod === 'card' ? 'text-black' : 'text-gray-400'} />
                    <span className="font-medium text-gray-900">Online Kredi Kartı</span>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'card' ? 'border-black' : 'border-gray-300'
                }`}>
                    {paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                </div>
            </label>

            {/* Kapıda Ödeme Seçeneği */}
            <label 
                className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                    paymentMethod === 'cash' ? 'border-black bg-black/5' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('cash')}
            >
                <div className="flex items-center gap-3">
                    <Wallet size={20} className={paymentMethod === 'cash' ? 'text-black' : 'text-gray-400'} />
                    <span className="font-medium text-gray-900">Kapıda Ödeme</span>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'cash' ? 'border-black' : 'border-gray-300'
                }`}>
                    {paymentMethod === 'cash' && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                </div>
            </label>
          </div>
        </section>

        {/* Sipariş Özeti */}
        <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Sipariş Özeti</h2>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                    <span>Truffle Burger (x1)</span>
                    <span>₺325</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Cajun Patates (x2)</span>
                    <span>₺180</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Teslimat Ücreti</span>
                    <span>₺25</span>
                </div>
                <div className="border-t border-gray-100 my-2 pt-2 flex justify-between font-bold text-lg text-black">
                    <span>Toplam</span>
                    <span>₺530</span>
                </div>
            </div>
        </section>
      </div>

      {/* Sticky Footer Button - DÜZELTİLDİ */}
      {/* bottom-0 yerine bottom-[70px] kullanıldı, böylece BottomNav'ın üzerinde durur */}
      <div className="fixed bottom-[70px] left-0 right-0 p-4 bg-white border-t border-gray-100 z-20 pb-safe">
        <div className="max-w-screen-md mx-auto">
            <button 
                onClick={() => setIsOrderComplete(true)}
                className="w-full bg-black text-white py-4 rounded-full font-bold text-base hover:bg-gray-800 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
                <span>Siparişi Tamamla</span>
                <ChevronRight size={18} />
            </button>
        </div>
      </div>

    </div>
  );
}
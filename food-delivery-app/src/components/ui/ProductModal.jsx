'use client'

import React, { useState } from 'react';
import { X, Minus, Plus, Check } from 'lucide-react';

export default function ProductModal({ isOpen, onClose, product, handle }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState([]);

  if (!isOpen || !product) return null;

  // Örnek Ekstra Malzemeler (Opsiyonel)
  const extras = [
    
  ];

  const handleOptionToggle = (id) => {
    if (selectedOptions.includes(id)) {
      setSelectedOptions(selectedOptions.filter(optId => optId !== id));
    } else {
      setSelectedOptions([...selectedOptions, id]);
    }
  };

  const calculateTotal = () => {
    const extrasTotal = selectedOptions.reduce((total, id) => {
      const extra = extras.find(e => e.id === id);
      return total + (extra ? extra.price : 0);
    }, 0);
    return (product.unit_price + extrasTotal) * quantity;
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Arkaplan Karartma (Backdrop) */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal İçeriği */}
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        
        {/* Kapat Butonu */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Ürün Görseli */}
        <div className="h-48 w-full bg-gray-100 shrink-0">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Kaydırılabilir İçerik Alanı */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
            <p className="text-gray-500 mt-2 text-sm leading-relaxed">
              {product.description}
            </p>
            <p className="text-lg font-semibold text-black mt-2">₺{product.unit_price}</p>
          </div>

          {/* Seçenekler Grubu */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-2">
            </h3>
            <div className="space-y-3">
              {extras.map((extra) => (
                <label 
                  key={extra.id} 
                  className="flex items-center justify-between p-3 border border-gray-100 rounded-lg cursor-pointer hover:border-black/20 transition-colors active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      selectedOptions.includes(extra.id) 
                        ? 'bg-black border-black text-white' 
                        : 'border-gray-300 bg-white'
                    }`}>
                      {selectedOptions.includes(extra.id) && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{extra.name}</span>
                  </div>
                  {extra.price > 0 && (
                    <span className="text-sm text-gray-500">+₺{extra.price}</span>
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Alt Sabit Alan (Footer) */}
        <div className="p-4 border-t border-gray-100 bg-white shrink-0 safe-pb">
          <div className="flex items-center gap-4">
            {/* Adet Seçimi */}
            <div className="flex items-center border border-gray-300 rounded-full px-1 py-1">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 disabled:opacity-50"
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center font-semibold text-black">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-black"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Sepete Ekle Butonu */}
            <button 
              className="flex-1 bg-black text-white py-3 rounded-full font-bold text-sm hover:bg-gray-800 transition-colors flex justify-between px-6"
              onClick={() => {
                console.log("Sepete eklendi:", { product, quantity, selectedOptions });
                onClose();
              }}
            >
              <span>Sepete Ekle</span>
              <span>₺{calculateTotal()}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
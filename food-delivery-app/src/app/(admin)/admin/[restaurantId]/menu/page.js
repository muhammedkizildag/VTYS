'use client'

import React, { use, useEffect, useState } from 'react';
import { Plus, Edit3, Trash2, Image as ImageIcon, Search, X, Check, UploadCloud } from 'lucide-react';

export default function MenuManagementPage({ params }) {
  // Next.js params unwrapping
  params = use(params);

  const [activeCategory, setActiveCategory] = useState('Tümü');
  const categories = [];

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
    price: '',
    category: 'Burgerler',
    image: '',
    isAvailable: true
  });

  // Örnek Menü Verileri
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Truffle Burger",
      description: "150gr dana köfte, trüf mayonez, karamelize soğan.",
      price: 285,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=60",
      category: "Burgerler",
      isAvailable: false
    },
    {
      id: 2,
      name: "Cheeseburger",
      description: "150gr dana köfte, cheddar peyniri, turşu.",
      price: 240,
      image: "https://images.unsplash.com/photo-1551782450-17144efb9c50?auto=format&fit=crop&w=200&q=60",
      category: "Burgerler",
      isAvailable: true
    },
    {
      id: 3,
      name: "Cajun Patates",
      description: "Özel baharatlı kızartma.",
      price: 90,
      image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=200&q=60",
      category: "Yan Lezzetler",
      isAvailable: true
    }
  ]);

  // Modal Açma Fonksiyonu (Hem Ekleme Hem Düzenleme İçin)
  const openModal = (productOrCategory) => {
    if (typeof productOrCategory === 'string') {
      // --- YENİ EKLEME MODU ---
      // Eğer parametre string ise (kategori adı), formu sıfırla
      setFormData({
        id: null, // ID yoksa yeni kayıt demektir
        name: '',
        description: '',
        price: '',
        category: productOrCategory === 'Tümü' ? 'Burgerler' : productOrCategory,
        image: '',
        isAvailable: true
      });
    } else {
      // --- DÜZENLEME MODU ---
      // Eğer parametre obje ise (ürün), formu o ürünle doldur
      setFormData({
        id: productOrCategory.id,
        name: productOrCategory.name,
        description: productOrCategory.description,
        price: productOrCategory.unit_price,
        category: '0',
        image: productOrCategory.image,
        isAvailable: productOrCategory.status == 'availabe' ? true : false
      });
    }
    setIsModalOpen(true);
  };

  // Ürün Kaydetme (Ekleme veya Güncelleme)
  const handleSaveProduct = async (e) => {
    e.preventDefault();

    // Basit validasyon
    if (!formData.name || !formData.price) return;

    if (formData.id) {
      // --- GÜNCELLEME ---
      setProducts(products.map(p =>
        p.id === formData.id
          ? { ...formData, price: Number(formData.price) }
          : p
      ));

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurant/products/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
        restaurant_id: params.restaurantId,
        ...formData
        })
      });

    } else {
      // --- YENİ EKLEME ---


      const newProduct = {
        name: formData.name,
        description: formData.description,
        isAvailable: formData.isAvailable,
        category: formData.category,
        price: formData.price,
        image: formData.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=60"
      };

      console.log(newProduct)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurant/products?restaurant_id=${params.restaurantId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(newProduct)
      });
      console.log(res)

      setProducts([...products, newProduct]);
    }

    setIsModalOpen(false);
  };

  // Basit Silme Fonksiyonu
  const handleDeleteProduct = (id) => {
    if (confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  useEffect(() => {


    (async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurant/products?restaurant_id=${params.restaurantId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setProducts(data)
          console.log("Fetched Data:", data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    })();
  }, [params]);

  // Kategoriye göre filtreleme
  const filteredProducts = activeCategory === 'Tümü'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="space-y-6 font-sans text-gray-900 relative min-h-screen pb-20">

      {/* Üst Başlık ve Aksiyon */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Menü Yönetimi</h1>
          <p className="text-gray-500 text-sm">Ürünlerinizi düzenleyin, fiyatları güncelleyin.</p>
        </div>
        <button
          onClick={() => openModal(activeCategory)}
          className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-black/10 active:scale-95 transform duration-150"
        >
          <Plus size={20} />
          Yeni Ürün Ekle
        </button>
      </div>

      {/* Kategori Sekmeleri */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-100 no-scrollbar">
        <button
          onClick={() => setActiveCategory('Tümü')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === 'Tümü'
            ? 'bg-black text-white'
            : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
        >
          Tümü
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat
              ? 'bg-black text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
          >
            {cat}
          </button>
        ))}
        <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-black border border-dashed border-gray-200 hover:border-black transition-colors">
          + Kategori
        </button>
      </div>

      {/* Arama */}
      <div className="relative">
        <input
          type="text"
          placeholder="Bu kategoride ürün ara..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all"
        />
        <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
      </div>

      {/* Ürün Listesi */}
      <div className="grid grid-cols-1 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.product_id} className="bg-white p-4 rounded-xl border border-gray-100 flex gap-4 items-center shadow-sm hover:border-black transition-all group">

            {/* Görsel */}
            <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0 relative">
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              {!(product.status == 'available') && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">Tükendi</span>
                </div>
              )}
            </div>

            {/* Bilgiler */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-black text-lg truncate">{product.name}</h3>
                <span className="font-bold text-black bg-gray-50 px-2 py-1 rounded text-sm">₺{product.unit_price}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1 line-clamp-1">{product.description}</p>

              <div className="flex items-center gap-4 mt-3">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${product.status == 'available' ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${product.status == 'available' ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                  <span className="text-xs font-medium text-gray-600">{product.status == 'available' ? 'Satışta' : 'Pasif'}</span>
                </label>
              </div>
            </div>

            {/* Aksiyonlar */}
            <div className="flex flex-col gap-2 border-l border-gray-100 pl-4">
              <button
                onClick={() => openModal(product)}
                className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                title="Düzenle"
              >
                <Edit3 size={18} />
              </button>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Sil"
              >
                <Trash2 size={18} />
              </button>
            </div>

          </div>
        ))}

        {/* Yeni Ekle Placeholder */}
        <button
          onClick={() => openModal(activeCategory)}
          className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 hover:border-black hover:text-black transition-all bg-gray-50/50 hover:bg-white group"
        >
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
            <Plus size={24} />
          </div>
          <span className="font-bold">Yeni {activeCategory === 'Tümü' ? 'Ürün' : activeCategory.slice(0, -1)} Ekle</span>
        </button>
      </div>

      {/* --- ADD/EDIT PRODUCT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Content */}
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative z-10 flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">

            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-black">
                {formData.id ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Form Scrollable Area */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="productForm" onSubmit={handleSaveProduct} className="space-y-5">

                {/* Image Upload Simulation */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Ürün Görseli</label>
                  <div className="flex gap-4 items-start">
                    <div className="w-24 h-24 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative shrink-0">
                      {formData.image ? (
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="text-gray-300" size={24} />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        placeholder="Görsel URL'si yapıştırın..."
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none text-sm"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      />
                      <p className="text-xs text-gray-400">Örn: https://images.unsplash.com/...</p>
                    </div>
                  </div>
                </div>

                {/* Name & Price Row */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Ürün Adı</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white border focus:border-black rounded-xl focus:outline-none transition-all"
                      placeholder="Örn: Double Burger"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Fiyat (₺)</label>
                    <input
                      required
                      type="number"
                      className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white border focus:border-black rounded-xl focus:outline-none transition-all"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                </div>

                {/* Category & Status */}
                <div className="grid grid-cols-2 gap-4">
                  {/* <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Kategori</label>
                        <select 
                            className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white border focus:border-black rounded-xl focus:outline-none transition-all appearance-none cursor-pointer"
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div> */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Durum</label>
                    <div
                      onClick={() => setFormData({ ...formData, isAvailable: !formData.isAvailable })}
                      className={`w-full px-4 py-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${formData.isAvailable ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                    >
                      <span className="font-medium text-sm">{formData.isAvailable ? 'Satışta' : 'Satışa Kapalı'}</span>
                      {formData.isAvailable && <Check size={16} />}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Açıklama</label>
                  <textarea
                    className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white border focus:border-black rounded-xl focus:outline-none transition-all resize-none h-24"
                    placeholder="İçindekiler, sunum şekli vb..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  ></textarea>
                </div>

              </form>
            </div>

            {/* Footer Actions */}
            <div className="p-5 border-t border-gray-100 flex gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                form="productForm"
                type="submit"
                className="flex-1 px-4 py-3 rounded-xl font-bold bg-black text-white hover:bg-gray-800 transition-colors shadow-lg shadow-black/20"
              >
                {formData.id ? 'Güncelle' : 'Kaydet'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
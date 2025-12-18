'use client'

import React, { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Plus, Trash2, Check, Building, Navigation } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AddressesPage() {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);

  // Veritabanı şemasına uygun Örnek Veriler
  // DB: address_id, customer_id, city, district, street, neighbourhood, number
  const [addresses, setAddresses] = useState([
    {
      title: 'ev',
      address_id: "1",
      city: "İstanbul",
      district: "Kadıköy",
      neighbourhood: "Caferağa Mah.",
      street: "Moda Cad.",
      number: "12/4"
    },
    {
      address_id: "2",
      city: "İstanbul",
      district: "Sarıyer",
      neighbourhood: "Maslak Mah.",
      street: "Büyükdere Cad.",
      number: "245"
    }
  ]);

  // Form State'i (DB Sütunlarıyla Birebir)
  const [formData, setFormData] = useState({
    title: '',
    city: '',
    district: '',
    neighbourhood: '',
    street: '',
    number: ''
  });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/address`, {
      credentials: 'include',
      method: 'GET'
    }).then(async (r) => {
      const _addresses = (await r.json()).addresses;
      console.log(_addresses);
      setAddresses(_addresses);
    })

  }, []);
  const handleSelectAddress = async (addressId) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/select-address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Token için gerekli
        body: JSON.stringify({ address_id: addressId })
      });

      if (res.ok) {
        // Başarılıysa kullanıcıyı ana sayfaya yönlendir
        router.push('/');
      } else {
        console.error("Adres seçilemedi");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Backend'e gönderilecek veri yapısı
    const newAddress = {// Backend'de UUID olacak
      ...formData
    };

    try {
      console.log(newAddress);
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/address`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAddress)
      });
      setAddresses([...addresses, newAddress]);
      setIsAdding(false);
      setFormData({ city: '', district: '', neighbourhood: '', street: '', number: '' });
    }

    catch (e) {
      console.log(e)
    }


  };

  const handleDelete = async (id) => {
    setAddresses(addresses.filter(addr => addr.address_id !== id));

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/address`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address_id: id })
      });

      router.refresh();
    }

    catch (e) {

    }

  };

  const goBack = () => {
    if (isAdding) {
      setIsAdding(false);
    } else {
      router.push('/profile');
    }
  };

  return (
    <div className="bg-white min-h-screen pb-24 font-sans text-gray-900">

      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100 flex items-center sticky top-0 z-10">
        <button
          onClick={goBack}
          className="mr-4 p-1 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft size={20} className="text-black" />
        </button>
        <h1 className="text-lg font-bold text-black">
          {isAdding ? 'Yeni Adres Ekle' : 'Adreslerim'}
        </h1>
      </div>

      <div className="p-4 max-w-md mx-auto">

        {/* DURUM 1: Adres Ekleme Formu (DB Şemasına Uygun) */}
        {isAdding ? (
          <form onSubmit={handleSave} className="space-y-4 animate-in fade-in slide-in-from-bottom-4">

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Adres Adı</label>
              <input
                name="title"
                type="text"
                placeholder="Örn: Ev, İş"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">İl (City)</label>
                <input
                  name="city"
                  type="text"
                  placeholder="İstanbul"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">İlçe (District)</label>
                <input
                  name="district"
                  type="text"
                  placeholder="Kadıköy"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                  value={formData.district}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Mahalle (Neighbourhood)</label>
              <input
                name="neighbourhood"
                type="text"
                placeholder="Örn: Caferağa Mah."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                value={formData.neighbourhood}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Cadde / Sokak (Street)</label>
              <input
                name="street"
                type="text"
                placeholder="Örn: Moda Cad. veya Lale Sok."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                value={formData.street}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Bina / Kapı No (Number)</label>
              <input
                name="number"
                type="text"
                placeholder="Örn: 12/4"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                value={formData.number}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3.5 rounded-full font-bold hover:bg-gray-800 transition-colors mt-4 flex items-center justify-center gap-2"
            >
              <Check size={18} />
              Adresi Kaydet
            </button>
          </form>
        ) : (
          /* DURUM 2: Adres Listesi */
          <div className="space-y-4">
            {addresses.map((item) => (
              <div key={item.address_id} onClick={() => handleSelectAddress(item.address_id)} className="border border-gray-100 rounded-xl p-4 flex gap-4 hover:border-black transition-colors bg-white shadow-sm group">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0 text-gray-600">
                  {/* İkonu başlığa göre seçebiliriz (Opsiyonel) */}
                  {item.title?.toLowerCase().includes('ev') ? <Building size={20} /> : <MapPin size={20} />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      {/* Başlık ve Adres */}
                      <h3 className="font-bold text-black text-lg">{item.title}</h3>
                      <p className="text-sm text-gray-800 font-medium mt-0.5">{item.street} No: {item.number}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(item.address_id)}
                      className="text-gray-300 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {item.neighbourhood}, {item.district} / {item.city}
                  </p>
                </div>
              </div>
            ))}

            {/* Yeni Ekle Butonu */}
            <button
              onClick={() => setIsAdding(true)}
              className="w-full border-2 border-dashed border-gray-200 rounded-xl p-4 flex items-center justify-center gap-2 text-gray-500 hover:border-black hover:text-black transition-colors font-medium mt-4 group"
            >
              <div className="bg-gray-50 p-2 rounded-full group-hover:bg-black group-hover:text-white transition-colors">
                <Plus size={20} />
              </div>
              Yeni Adres Ekle
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
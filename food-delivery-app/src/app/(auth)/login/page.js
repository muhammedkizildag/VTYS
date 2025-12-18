'use client'

import { useState } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); 


    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = {
            email,
            password 
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            console.log(res)
            setLoading(false)
            router.push('/');
        }

        catch (e) {
            console.log(e);
            setLoading(false);
        }
        
    };

    return (
        <div className="flex flex-col w-full bg-white p-8 border border-gray-200 rounded-xl shadow-sm">
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-black">Giriş Yap</h2>
                <p className="text-sm text-gray-500 mt-2">Lezzetli yemeklere ulaşmak için giriş yapın</p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col space-y-4">
                <div>
                    <label className="text-xs font-semibold text-gray-700 uppercase mb-1 block">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        disabled={loading}
                        placeholder="ornek@email.com"
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                        required
                    />
                </div>

                <div>
                    <label className="text-xs font-semibold text-gray-700 uppercase mb-1 block">Şifre</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        disabled={loading}
                        placeholder="••••••••"
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-colors duration-200 disabled:opacity-70 mt-2"
                >
                    {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                </button>
            </form>

            <div className="mt-6 text-center text-sm">
                <span className="text-gray-500">Hesabın yok mu? </span>
                <Link href="/signup" className="font-bold text-black hover:underline">Kayıt Ol</Link>
            </div>
        </div>
    );
}
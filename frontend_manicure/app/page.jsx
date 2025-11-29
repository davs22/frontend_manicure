"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

// ✅ CORREÇÃO DOS IMPORTS (./component no singular)
import Feed from "./component/post/Feed";
import AuthPage from "./component/auth/AuthPage";
import FeedUsuarios from "./component/Feed/FeedUsuarios"; 
import FiltroManicures from "./component/Home/FiltroManicures"; 
import { logout } from "./utils/api";

export default function Home() {
    const [authModal, setAuthModal] = useState(false);
    const [isLogged, setIsLogged] = useState(false);
    const [search, setSearch] = useState("");
    const router = useRouter();
    
    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
        setIsLogged(!!token);
    }, []);

    const handleLogout = () => { logout(); setIsLogged(false); window.location.reload(); };
    const irPara = (url) => { 
        if (!isLogged && (url.includes('agendamentos') || url.includes('perfil'))) { 
            setAuthModal(true); return; 
        } 
        router.push(url); 
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' && search.trim()) {
            router.push(`/pesquisa?q=${encodeURIComponent(search)}`);
        }
    };

    return (
        <div className="min-h-screen w-full">
            {authModal && <AuthPage onClose={() => { setAuthModal(false); if(typeof window !== 'undefined' && localStorage.getItem("token")) setIsLogged(true); }} />}

            {/* HEADER FIXO */}
            <header className="flex flex-col md:flex-row justify-between items-center py-4 px-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-black sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
                    <span className="text-3xl">💅</span>
                    <h1 className="text-2xl font-extrabold text-pink-600">Belanetic</h1>
                </div>

                <div className="relative w-full md:w-96 my-2 md:my-0">
                    <input type="text" placeholder="Pesquisar..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={handleSearch}
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full py-2 px-4 pl-10 focus:ring-2 focus:ring-pink-500 placeholder-gray-400" />
                    <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                </div>

                <div className="flex items-center space-x-3">
                    <button onClick={() => irPara('/agendamentos')} className="hover:text-pink-600 font-semibold px-3 py-2">📅 Agenda</button>
                    <button onClick={() => irPara('/posts')} className="hover:text-pink-600 font-semibold px-3 py-2">📷 Feed</button>
                    <button onClick={() => irPara('/perfil')} className="hover:text-pink-600 font-semibold px-3 py-2">👤 Perfil</button>
                    {isLogged ? 
                        <button onClick={handleLogout} className="text-red-500 border border-red-200 px-4 py-1 rounded-full hover:bg-red-50">Sair</button> : 
                        <button onClick={() => setAuthModal(true)} className="bg-pink-600 text-white px-5 py-2 rounded-full hover:bg-pink-700">Entrar</button>
                    }
                </div>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-6 py-8 max-w-[1400px] mx-auto">
                {/* ESQUERDA (Painel de Boas Vindas) */}
                <div className="hidden lg:block lg:col-span-3">
                    <div className="sticky top-24 bg-pink-50 dark:bg-pink-900/10 rounded-xl p-6 border border-pink-100 dark:border-pink-800">
                        <h3 className="font-bold text-pink-700 dark:text-pink-300">Painel</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Bem-vindo(a) à sua comunidade de Nail Design.</p>
                        {isLogged && <button onClick={() => irPara('/agendamentos')} className="w-full mt-4 bg-white dark:bg-gray-800 text-pink-600 py-2 rounded shadow-sm font-bold border border-pink-200 hover:bg-pink-50">Ver Agenda</button>}
                    </div>
                </div>

                {/* CENTRO (Feed de Posts) */}
                <div className="col-span-1 lg:col-span-6">
                    <Feed />
                </div>

                {/* DIREITA (Filtros e Sugestões) */}
                <div className="hidden lg:block lg:col-span-3">
                    <div className="sticky top-24 space-y-6">
                        
                        {/* 1. Novo Filtro de Manicures */}
                        <FiltroManicures />

                        {/* 2. Sugestões de quem seguir */}
                        <FeedUsuarios />
                    </div>
                </div>
            </main>
        </div>
    );
}
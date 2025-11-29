"use client";
import React, { useEffect, useState } from 'react';
import CriarAgendamento from '../../components/Agendamento/CriarAgendamento';
import MinhaAgenda from '../../components/Agendamento/MinhaAgenda';
// 🎯 CORREÇÃO DE CAMINHO: Usando o alias absoluto '@/'
import { getCurrentUser, apiGetUserById } from '@/app/utils/api'; 
import { useRouter } from 'next/navigation';

export default function AgendamentosPage() {
    const [isManicure, setIsManicure] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const user = getCurrentUser();
        if(!user) { router.push('/'); return; }

        // A lógica de manicure está correta aqui
        apiGetUserById(user.id).then(u => {
            if (u && (u.manicure || u.especialidade)) {
                setIsManicure(true);
            }
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6 min-h-screen">
            <button onClick={() => router.back()} className="mb-4 text-gray-500 hover:text-pink-600">← Voltar</button>
            <h1 className="text-3xl font-extrabold text-pink-600 mb-2 text-center">Central de Agendamentos</h1>
            
            <div className="grid gap-12 mt-8">
                {/* VISÃO DA MANICURE */}
                {!loading && isManicure && (
                    <div className="animate-fadeIn">
                        <MinhaAgenda />
                        <div className="my-8 border-t border-gray-200 relative text-center">
                            <span className="bg-gray-50 px-4 text-gray-400 text-sm relative -top-3">OU</span>
                        </div>
                    </div>
                )}
                
                {/* VISÃO DO CLIENTE */}
                <div>
                    <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-6 text-center">Agendar Horário</h3>
                    <CriarAgendamento />
                </div>
            </div>
        </div>
    );
}
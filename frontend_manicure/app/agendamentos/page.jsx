"use client";
import React, { useEffect, useState } from 'react';
import CriarAgendamento from '../component/Agendamento/CriarAgendamento';
import MinhaAgenda from '../component/Agendamento/MinhaAgenda';
import { getCurrentUser, apiGetUserById } from '../utils/api';

export default function AgendamentosPage() {
    const [isManicure, setIsManicure] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = getCurrentUser();
        if(!user) { router.push('/'); return; }

        apiGetUserById(user.id).then(u => {
            // CORREÇÃO: O backend manda "manicure" (sem o 'is') e "especialidade" na raiz
            if (u && (u.manicure || u.especialidade)) {
                setIsManicure(true);
            }
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6 pb-20 bg-white dark:bg-black min-h-screen">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-extrabold text-pink-600 mb-2">Central de Agendamentos</h1>
                <p className="text-gray-500">Gerencie seus horários e serviços.</p>
            </div>

            <div className="grid gap-12">
                {/* SÓ MOSTRA SE FOR MANICURE */}
                {!loading && isManicure && (
                    <div className="animate-fadeIn">
                        <MinhaAgenda />
                        <div className="my-8 border-t border-gray-100 dark:border-gray-800 relative">
                            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-black px-4 text-gray-400 text-sm font-medium">OU</span>
                        </div>
                    </div>
                )}

                {/* FORMULÁRIO PARA TODOS */}
                <div>
                    {isManicure && <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-6 text-center">Marcar horário com outra profissional</h3>}
                    <CriarAgendamento />
                </div>
            </div>
        </div>
    );
}
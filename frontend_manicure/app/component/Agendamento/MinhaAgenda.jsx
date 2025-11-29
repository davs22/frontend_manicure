import React, { useEffect, useState } from "react";

import { apiGetAgendaManicure } from "../../utils/api";

export default function MinhaAgenda() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarAgenda() {
      try {
        // Chama a função da API (que aponta para /agendamentos/minha-agenda)
        const data = await apiGetAgendaManicure();
        console.log("Dados da Agenda Recebidos:", data); // Debug no F12
        setAgendamentos(data || []);
      } catch (err) {
        console.error("Erro ao carregar agenda:", err);
      } finally {
        setLoading(false);
      }
    }
    carregarAgenda();
  }, []);

  if (loading) return <p className="text-center text-pink-500 py-4 animate-pulse">Carregando sua agenda...</p>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 mt-8">
        <h3 className="text-xl font-bold text-purple-700 dark:text-purple-400 mb-6 flex items-center gap-2">
            🗓️ Agenda de Clientes (Agendaram com você)
        </h3>
        
        {agendamentos.length === 0 ? (
            <div className="text-center py-8 text-gray-400 border border-dashed border-gray-200 rounded-xl">
                <p>Nenhum cliente agendou com você ainda.</p>
            </div>
        ) : (
            <div className="space-y-4">
                {agendamentos.map(a => (
                    <div key={a.idAgendamento} className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div className="mb-2 sm:mb-0">
                            {/* Nome do Serviço */}
                            <p className="font-bold text-purple-900 dark:text-purple-200 text-lg">
                                {a.descricao || "Sem descrição"}
                            </p>
                            
                            {/* Nome do Cliente (Com proteção contra nulo) */}
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Cliente: <strong className="text-black dark:text-white">
                                    {a.usuario ? a.usuario.nome : "Usuário Desconhecido"}
                                </strong>
                            </p>
                        </div>
                        
                        {/* Data e Hora */}
                        <div className="text-left sm:text-right bg-white dark:bg-gray-800 p-2 rounded-lg border border-purple-100 dark:border-gray-700 min-w-[100px] text-center">
                            <span className="block text-xl font-bold text-gray-800 dark:text-white">
                                {a.hora ? a.hora.substring(0, 5) : "--:--"}
                            </span>
                            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                                {a.data}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
}
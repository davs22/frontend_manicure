"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGetManicures } from "../../utils/api"; // Ajuste o caminho se necessário

export default function FiltroManicures() {
  const router = useRouter();
  const [manicures, setManicures] = useState([]);
  const [busca, setBusca] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Carrega todas as manicures ao iniciar
  useEffect(() => {
    async function load() {
      try {
        const data = await apiGetManicures();
        setManicures(data || []);
        setResultados(data || []);
      } catch (error) {
        console.error("Erro ao buscar manicures", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // 2. A Mágica do Filtro: Roda toda vez que o texto 'busca' muda
  useEffect(() => {
    if (!busca.trim()) {
      setResultados(manicures.slice(0, 5)); // Mostra só 5 se não estiver buscando
      return;
    }

    const termo = busca.toLowerCase();

    const filtrados = manicures.filter((user) => {
      // Verifica se o termo existe em algum desses campos
      const matchNome = user.nome?.toLowerCase().includes(termo);
      const matchEspecialidade = user.especialidade?.toLowerCase().includes(termo);
      const matchRegiao = user.regiao?.toLowerCase().includes(termo);
      const matchIdade = user.idade?.toString().includes(termo);

      return matchNome || matchEspecialidade || matchRegiao || matchIdade;
    });

    setResultados(filtrados);
  }, [busca, manicures]);

  if (loading) return <div className="animate-pulse bg-gray-200 h-20 rounded-xl mb-4"></div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 mb-6">
      <h3 className="font-bold text-pink-600 dark:text-pink-400 mb-3 flex items-center gap-2">
        💅 Encontre sua Profissional
      </h3>

      {/* Input de Busca */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Nome, região, especialidade..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg py-2 px-3 pl-9 text-sm outline-none focus:ring-2 focus:ring-pink-500 transition"
        />
        <span className="absolute left-3 top-2.5 text-gray-400 text-xs">🔍</span>
      </div>

      {/* Lista de Resultados */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
        {resultados.length === 0 ? (
          <p className="text-xs text-center text-gray-400 py-2">Nenhuma manicure encontrada.</p>
        ) : (
          resultados.map((m) => (
            <div
              key={m.idUsuario}
              onClick={() => router.push(`/perfil/${m.idUsuario}`)}
              className="flex items-center gap-3 p-2 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-lg cursor-pointer transition group"
            >
              {/* Foto Pequena */}
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 border border-gray-100 group-hover:border-pink-200">
                {m.urlFotoPerfil ? (
                  <img src={m.urlFotoPerfil} alt={m.nome} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-gray-400 text-xs">
                    {m.nome?.charAt(0)}
                  </div>
                )}
              </div>

              {/* Informações */}
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate group-hover:text-pink-600 transition">
                  {m.nome}
                </span>
                <div className="flex flex-wrap gap-1 text-[10px] text-gray-500">
                  {m.especialidade && <span>✨ {m.especialidade}</span>}
                  {m.regiao && <span>📍 {m.regiao}</span>}
                  {m.idade && <span>🎂 {m.idade} anos</span>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
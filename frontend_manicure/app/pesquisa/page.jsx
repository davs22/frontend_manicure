"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
// Ajuste do import: sobe 1 nível (pesquisa -> app) e entra em utils
import { apiSearchUsers } from "../../utils/api";

// 1. Criamos um componente interno para a lógica de busca
function ConteudoPesquisa() {
  const searchParams = useSearchParams();
  const termo = searchParams.get("q"); 
  const router = useRouter();
  
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (termo) {
      setLoading(true);
      apiSearchUsers(termo)
        .then(data => setResultados(data || []))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [termo]);

  return (
    <div className="min-h-screen bg-white dark:bg-black p-6">
      <div className="max-w-2xl mx-auto mb-6">
          <button onClick={() => router.push('/')} className="text-gray-500 hover:text-pink-600 font-bold flex items-center gap-2">
              ← Voltar para Home
          </button>
      </div>

      <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Resultados para: <span className="text-pink-600">"{termo}"</span>
          </h1>

          {loading && <p className="text-gray-500 animate-pulse">Pesquisando...</p>}

          {!loading && resultados.length === 0 && (
            <div className="text-center py-10 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                <p className="text-gray-500">Nenhum usuário encontrado.</p>
            </div>
          )}

          <div className="space-y-3">
            {resultados.map(user => (
              <div 
                key={user.idUsuario} 
                onClick={() => router.push(`/perfil/${user.idUsuario}`)}
                className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl cursor-pointer hover:shadow-md transition border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden border border-gray-200">
                    {user.urlFotoPerfil ? (
                        <img src={user.urlFotoPerfil} className="w-full h-full object-cover" alt={user.nome} />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-gray-500 text-xl">
                            {user.nome?.charAt(0).toUpperCase()}
                        </div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 dark:text-white text-lg">{user.nome}</p>
                    {(user.isManicure || user.especialidade) ? (
                        <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-md font-bold mt-1 inline-block">
                            Manicure • {user.especialidade || "Geral"}
                        </span>
                    ) : (
                        <span className="text-xs text-gray-400 mt-1 inline-block">Usuário Comum</span>
                    )}
                  </div>
                </div>
                <span className="text-gray-400 text-2xl">›</span>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
}

// 2. O Componente Principal apenas "encapsula" o conteúdo com Suspense
export default function PesquisaPage() {
  return (
    // O fallback é o que aparece enquanto o Next.js descobre os parâmetros da URL
    <Suspense fallback={<div className="text-center p-10 text-gray-500">Carregando busca...</div>}>
      <ConteudoPesquisa />
    </Suspense>
  );
}
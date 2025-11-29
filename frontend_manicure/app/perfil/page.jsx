"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGetUserById, apiUpdateUser, getCurrentUser, logout } from "../utils/api";

export default function PerfilPage() {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const [isManicure, setIsManicure] = useState(false);
  
  const [user, setUser] = useState({ idUsuario: null, nome: "", email: "", idade: "", urlFotoPerfil: "", especialidade: "", regiao: "" });

  useEffect(() => {
    async function load() {
      const currentUser = getCurrentUser();
      if (!currentUser) return router.push("/");
      const data = await apiGetUserById(currentUser.id);
      setUser({...data, especialidade: data.especialidade || "", regiao: data.regiao || ""});
      if (data.isManicure || (data.especialidade && data.especialidade.trim() !== "")) setIsManicure(true);
    }
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const payload = {
        nome: user.nome, idade: user.idade, urlFotoPerfil: user.urlFotoPerfil,
        especialidade: isManicure ? user.especialidade : "", // VAZIO = REMOVER
        regiao: isManicure ? user.regiao : ""
    };
    try {
        await apiUpdateUser(user.idUsuario, payload);
        alert("Salvo!");
        window.location.reload();
    } catch (error) { alert("Erro: " + error.message); } 
    finally { setUpdating(false); }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 pb-20">
      {/* ... (cabeçalho da foto igual) ... */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6 text-center border border-gray-100">
        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-pink-500 bg-gray-200">
            {user.urlFotoPerfil ? <img src={user.urlFotoPerfil} className="w-full h-full object-cover" /> : null}
        </div>
        <h1 className="text-2xl font-bold mt-2 text-black">{user.nome}</h1>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl shadow p-8 space-y-6 text-black border border-gray-100">
        {/* ... (campos nome/idade iguais) ... */}
        <div className="grid gap-4">
            <label className="font-bold">Nome</label>
            <input type="text" value={user.nome} onChange={e => setUser({...user, nome: e.target.value})} className="border p-2 rounded w-full" />
            <label className="font-bold">Foto URL</label>
            <input type="text" value={user.urlFotoPerfil} onChange={e => setUser({...user, urlFotoPerfil: e.target.value})} className="border p-2 rounded w-full" />
        </div>

        <div className="bg-pink-50 p-5 rounded-xl border border-pink-100 mt-4">
            <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={isManicure} onChange={() => setIsManicure(!isManicure)} className="w-5 h-5 accent-pink-600" />
                <span className="font-bold text-pink-700">Sou Manicure</span>
            </label>
            {isManicure ? (
                <div className="mt-4 grid gap-4 animate-fadeIn">
                    <input type="text" placeholder="Especialidade" value={user.especialidade} onChange={e => setUser({...user, especialidade: e.target.value})} className="border p-2 rounded w-full" />
                    <input type="text" placeholder="Região" value={user.regiao} onChange={e => setUser({...user, regiao: e.target.value})} className="border p-2 rounded w-full" />
                </div>
            ) : <p className="text-xs text-red-500 mt-2">Ao salvar desmarcado, você deixa de ser manicure.</p>}
        </div>

        <button type="submit" disabled={updating} className="w-full bg-pink-600 text-white font-bold py-3 rounded-xl hover:bg-pink-700">Salvar</button>
        <button type="button" onClick={logout} className="w-full border border-red-200 text-red-500 font-bold py-3 rounded-xl mt-2">Sair</button>
      </form>
    </div>
  );
}
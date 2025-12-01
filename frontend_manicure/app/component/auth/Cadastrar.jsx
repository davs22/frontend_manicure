"use client";

import { useState } from "react";
import { apiRegister } from "../../utils/api";

export default function Cadastrar({ onSuccess }) {
  // 1. ESTADOS BASE
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");
  const [urlFotoPerfil, setUrlFotoPerfil] = useState(""); // Vai guardar o Base64
  const [preview, setPreview] = useState(null); // Para mostrar a foto na tela
  const [sexo, setSexo] = useState("F");

  // 2. ESTADOS CONDICIONAIS (Manicure)
  const [isManicure, setIsManicure] = useState(false);
  const [especialidade, setEspecialidade] = useState("");
  const [regiao, setRegiao] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Lógica de Converter Imagem ---
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // 1. Mostra preview imediato
      setPreview(URL.createObjectURL(file));

      // 2. Converte para Base64 para enviar pro banco
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => setUrlFotoPerfil(reader.result);
      reader.onerror = (error) => console.error("Erro ao ler arquivo:", error);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (senha !== senha2) { setError("As senhas não conferem."); return; }
    if (isManicure && (!especialidade || !regiao)) { setError("Preencha especialidade e região."); return; }

    setLoading(true);

    const baseData = {
      nome,
      idade: parseInt(idade),
      email,
      senha,
      urlFotoPerfil, // Enviando a string gigante da imagem
      sexo
    };

    let finalData = isManicure ? { ...baseData, especialidade, regiao } : baseData;

    try {
      await apiRegister(finalData);
      onSuccess?.();
    } catch (err) {
      setError(err.message || "Erro no cadastro.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 h-full">
      {error && <p className="text-red-500 text-center bg-red-100 p-2 rounded-lg text-sm">{error}</p>}

      {/* --- SELEÇÃO DE FOTO (Estilo bonito) --- */}
      <div className="flex flex-col items-center gap-2 mb-2">
        <label className="cursor-pointer group relative">
            <div className="w-24 h-24 rounded-full border-4 border-pink-200 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                {preview ? (
                    <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-3xl text-gray-300">📷</span>
                )}
            </div>
            {/* Input Invisível */}
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            <div className="absolute bottom-0 right-0 bg-pink-600 text-white p-1 rounded-full text-xs shadow-md border-2 border-white">➕</div>
        </label>
        <span className="text-xs text-gray-500">Toque para adicionar foto</span>
      </div>

      <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome Completo" className="input-padrao" required />
      
      <div className="grid grid-cols-2 gap-3">
        <input type="number" value={idade} onChange={(e) => setIdade(e.target.value)} placeholder="Idade" className="input-padrao" required />
        <select value={sexo} onChange={(e) => setSexo(e.target.value)} className="input-padrao" required>
            <option value="F">Feminino</option>
            <option value="M">Masculino</option>
        </select>
      </div>

      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="input-padrao" required />
      
      <div className="grid grid-cols-2 gap-3">
        <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Senha" className="input-padrao" autoComplete="new-password" required />
        <input type="password" value={senha2} onChange={(e) => setSenha2(e.target.value)} placeholder="Confirmar" className="input-padrao" autoComplete="new-password" required />
      </div>

      {/* CHECKBOX */}
      <div className="flex items-center p-2 bg-pink-50 dark:bg-gray-800 rounded-lg border border-pink-100 dark:border-gray-700">
        <input type="checkbox" id="isManicure" checked={isManicure} onChange={(e) => setIsManicure(e.target.checked)} className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500 accent-pink-600" />
        <label htmlFor="isManicure" className="ml-2 text-sm font-bold text-gray-700 dark:text-gray-200 cursor-pointer">Sou Profissional / Manicure</label>
      </div>

      {/* CAMPOS MANICURE */}
      {isManicure && (
        <div className="flex flex-col gap-3 animate-fadeIn bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
          <input type="text" value={especialidade} onChange={(e) => setEspecialidade(e.target.value)} placeholder="Especialidade (ex: Gel)" className="input-padrao" required={isManicure} />
          <input type="text" value={regiao} onChange={(e) => setRegiao(e.target.value)} placeholder="Região (ex: Centro)" className="input-padrao" required={isManicure} />
        </div>
      )}

      <button type="submit" disabled={loading} className="w-full bg-pink-600 text-white font-bold py-3 rounded-xl hover:bg-pink-700 transition shadow-lg shadow-pink-500/20 disabled:opacity-50 mt-2">
        {loading ? "Cadastrando..." : "Criar Conta"}
      </button>

      {/* Estilo local para limpar o código */}
      <style jsx>{`
        .input-padrao {
            width: 100%; padding: 12px; border-radius: 10px; border: 1px solid #e5e7eb;
            outline: none; transition: all;
        }
        .input-padrao:focus { border-color: #ec4899; ring: 2px; ring-color: #fbcfe8; }
        @media (prefers-color-scheme: dark) {
            .input-padrao { background-color: #1f2937; border-color: #374151; color: white; }
        }
      `}</style>
    </form>
  );
}

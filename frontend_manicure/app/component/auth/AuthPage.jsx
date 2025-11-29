"use client";
import React, { useState } from "react";
import { apiLogin, apiRegister } from "../../utils/api";

export default function AuthPage({ onClose }) {
  const [isLogin, setIsLogin] = useState(true); // Alternar entre Login e Cadastro
  const [loading, setLoading] = useState(false);
  
  // 💡 Lógica "Sou Manicure": Se true, mostra campos extras
  const [isProfessional, setIsProfessional] = useState(false);

  const [form, setForm] = useState({
    email: "",
    senha: "",
    nome: "",
    idade: "",
    sexo: "F",
    urlFotoPerfil: "", // Inicializa vazio
    // Campos específicos de Manicure
    especialidade: "",
    regiao: ""
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // --- LOGIN ---
        await apiLogin({ email: form.email, senha: form.senha });
        // Fecha o modal e recarrega a página para atualizar estados
        window.location.reload(); 
      } else {
        // --- CADASTRO ---
        // Limpa campos de manicure se o usuário desistiu de ser profissional no meio do caminho
        const payload = { ...form };
        
        // Se a foto estiver vazia, removemos ou mandamos string vazia (o backend aceita null/vazio)
        if (!payload.urlFotoPerfil) {
            payload.urlFotoPerfil = ""; 
        }

        if (!isProfessional) {
            delete payload.especialidade;
            delete payload.regiao;
        }

        await apiRegister(payload);
        alert("Conta criada com sucesso! Faça login agora.");
        setIsLogin(true); // Manda para tela de login
      }
    } catch (error) {
      alert("Erro: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // 1. Fundo Escuro (Overlay)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      
      {/* 2. Card do Modal (Com Scroll e Altura Máxima) */}
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Cabeçalho Fixo */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-pink-600">
                {isLogin ? "Bem-vindo(a) de volta! 👋" : "Crie sua conta ✨"}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
        </div>

        {/* 3. Corpo com Scroll (overflow-y-auto) */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Nome (Só no cadastro) */}
                {!isLogin && (
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nome Completo</label>
                        <input type="text" name="nome" placeholder="Seu nome lindo" onChange={handleChange} required 
                            className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none transition" />
                    </div>
                )}

                {/* Email */}
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <input type="email" name="email" placeholder="email@exemplo.com" onChange={handleChange} required 
                        className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none transition" />
                </div>

                {/* Senha */}
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
                    <input type="password" name="senha" placeholder="******" onChange={handleChange} required 
                        className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none transition" />
                </div>

                {/* CAMPOS EXTRAS DE CADASTRO */}
                {!isLogin && (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Idade</label>
                                <input type="number" name="idade" placeholder="Ex: 25" onChange={handleChange} required 
                                    className="w-full mt-1 p-3 rounded-lg border border-gray-300 outline-none" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Sexo</label>
                                <select name="sexo" onChange={handleChange} className="w-full mt-1 p-3 rounded-lg border border-gray-300 outline-none bg-white">
                                    <option value="F">Feminino</option>
                                    <option value="M">Masculino</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            {/* 💡 MUDANÇA AQUI: Campo Opcional */}
                            <label className="text-sm font-medium text-gray-700">Foto de Perfil <span className="text-gray-400 font-normal">(Opcional)</span></label>
                            <input type="text" name="urlFotoPerfil" placeholder="Cole a URL depois, se quiser..." onChange={handleChange} 
                                className="w-full mt-1 p-3 rounded-lg border border-gray-300 outline-none" />
                        </div>

                        {/* 🌟 TOGGLE: SOU PROFISSIONAL */}
                        <div className="p-4 bg-pink-50 rounded-xl border border-pink-100 mt-4">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" checked={isProfessional} onChange={() => setIsProfessional(!isProfessional)} 
                                    className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500 border-gray-300" />
                                <span className="font-semibold text-pink-700">Sou Manicure / Profissional</span>
                            </label>

                            {/* Campos Condicionais */}
                            {isProfessional && (
                                <div className="mt-4 space-y-3 animate-fadeIn">
                                    <div>
                                        <label className="text-xs font-bold text-pink-600 uppercase">Especialidade</label>
                                        <input type="text" name="especialidade" placeholder="Ex: Nail Art, Gel, Cutícula" onChange={handleChange} 
                                            className="w-full mt-1 p-2 rounded border border-pink-200 focus:border-pink-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-pink-600 uppercase">Região de Atendimento</label>
                                        <input type="text" name="regiao" placeholder="Ex: Vitória - Centro" onChange={handleChange} 
                                            className="w-full mt-1 p-2 rounded border border-pink-200 focus:border-pink-500 outline-none" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}

                <button type="submit" disabled={loading}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition transform disabled:opacity-50 disabled:cursor-not-allowed mt-4">
                    {loading ? "Processando..." : (isLogin ? "Entrar" : "Criar Conta")}
                </button>
            </form>
        </div>

        {/* Rodapé Fixo */}
        <div className="p-4 bg-gray-50 border-t text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-gray-600 hover:text-pink-600 font-medium">
                {isLogin ? "Não tem conta? Cadastre-se grátis!" : "Já tem conta? Faça login."}
            </button>
        </div>
      </div>
    </div>
  );
}
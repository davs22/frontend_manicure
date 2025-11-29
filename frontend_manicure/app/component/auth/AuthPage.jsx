"use client";
import React, { useState } from "react";
// Assumindo que a API já está configurada
import { apiLogin, apiRegister } from "../../utils/api";

export default function AuthPage({ onClose }) {
    const [isLogin, setIsLogin] = useState(true); // Alternar entre Login e Cadastro
    const [loading, setLoading] = useState(false);
    
    // Lógica "Sou Manicure": Se true, mostra campos extras
    const [isProfessional, setIsProfessional] = useState(false);

    const [form, setForm] = useState({
        email: "",
        senha: "",
        nome: "",
        idade: "",
        sexo: "F",
        urlFotoPerfil: "", 
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
                const data = await apiLogin({ email: form.email, senha: form.senha });
                
                // Verifica se o token veio, se não veio, joga um erro.
                if (data?.token) {
                    window.location.reload(); 
                } else {
                    // O erro de autenticação (se o status não for 401)
                    throw new Error("Credenciais inválidas.");
                }

            } else {
                // --- CADASTRO ---
                const payload = { ...form };
                
                // Se não for profissional, limpamos os campos para o backend
                if (!isProfessional) {
                    delete payload.especialidade;
                    delete payload.regiao;
                }
                
                // Remove campos vazios se não forem obrigatórios
                if (!payload.urlFotoPerfil) delete payload.urlFotoPerfil;
                
                await apiRegister(payload);
                alert("Conta criada com sucesso! Faça login agora.");
                setIsLogin(true); // Manda para tela de login
            }
        } catch (error) {
            // Captura o erro, seja do servidor (CORS ou 400) ou de JS
            const msg = error.message.includes("Failed to fetch") 
                        ? "Erro de conexão. Verifique se o Backend (Render) está ativo e se o CORS está configurado para Vercel."
                        : error.message;
            alert("Erro: " + msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        // 1. Fundo Escuro (Overlay)
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            
            {/* 2. Card do Modal (CRÍTICO PARA RESPONSIVIDADE) */}
            <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full sm:max-h-[95vh] max-h-screen">
                
                {/* Cabeçalho Fixo (flex-shrink-0 garante que ele não encolha) */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-2xl font-bold text-pink-600">
                        {isLogin ? "Bem-vindo(a)!" : "Crie sua conta"}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
                </div>

                {/* 3. Corpo com Scroll (ADICIONADO flex-grow para usar o espaço restante e permitir rolagem) */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {/* CAMPOS EXTRAS DE CADASTRO */}
                        {!isLogin && (
                            <>
                                {/* Nome Completo */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nome Completo</label>
                                    <input type="text" name="nome" placeholder="Seu nome lindo" onChange={handleChange} required 
                                        className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none transition dark:bg-gray-800 text-black" />
                                </div>

                                {/* Foto de Perfil (Opcional) */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Foto de Perfil <span className="text-gray-400 font-normal">(Opcional)</span></label>
                                    <input type="text" name="urlFotoPerfil" placeholder="Cole a URL depois, se quiser..." onChange={handleChange} 
                                        className="w-full mt-1 p-3 rounded-lg border border-gray-300 outline-none dark:bg-gray-800 text-black" />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                     {/* Idade */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Idade</label>
                                        <input type="number" name="idade" placeholder="Ex: 25" onChange={handleChange} required 
                                            className="w-full mt-1 p-3 rounded-lg border border-gray-300 outline-none dark:bg-gray-800 text-black" />
                                    </div>
                                     {/* Sexo */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Sexo</label>
                                        <select name="sexo" onChange={handleChange} className="w-full mt-1 p-3 rounded-lg border border-gray-300 outline-none bg-white dark:bg-gray-800 text-black">
                                            <option value="F">Feminino</option>
                                            <option value="M">Masculino</option>
                                        </select>
                                    </div>
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
                                                    className="w-full mt-1 p-2 rounded border border-pink-200 focus:border-pink-500 outline-none dark:bg-gray-800 text-black" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-pink-600 uppercase">Região de Atendimento</label>
                                                <input type="text" name="regiao" placeholder="Ex: Vitória - Centro" onChange={handleChange} 
                                                    className="w-full mt-1 p-2 rounded border border-pink-200 focus:border-pink-500 outline-none dark:bg-gray-800 text-black" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                        
                        {/* Email */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                            <input type="email" name="email" placeholder="email@exemplo.com" onChange={handleChange} required 
                                className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none transition dark:bg-gray-800 text-black" />
                        </div>

                        {/* Senha */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
                            <input type="password" name="senha" placeholder="******" onChange={handleChange} required 
                                className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none transition dark:bg-gray-800 text-black" />
                        </div>
                        
                        <button type="submit" disabled={loading}
                            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition transform disabled:opacity-50 disabled:cursor-not-allowed mt-4">
                            {loading ? "Processando..." : (isLogin ? "Entrar" : "Criar Conta")}
                        </button>
                    </form>
                </div>

                {/* Rodapé Fixo (flex-shrink-0 garante que ele não encolha) */}
                <div className="p-4 bg-gray-50 border-t text-center flex-shrink-0">
                    <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-gray-600 hover:text-pink-600 font-medium">
                        {isLogin ? "Não tem conta? Cadastre-se grátis!" : "Já tem conta? Faça login."}
                    </button>
                </div>
            </div>
        </div>
    );
}
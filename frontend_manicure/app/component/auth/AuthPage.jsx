"use client";
import React, { useState } from "react";
import { apiLogin, apiRegister } from "../../utils/api";

export default function AuthPage({ onClose }) {
    const [isLogin, setIsLogin] = useState(true); 
    const [loading, setLoading] = useState(false);
    
    // Estados do Formulário
    const [isProfessional, setIsProfessional] = useState(false);
    const [preview, setPreview] = useState(null); // Prévia da foto
    const [form, setForm] = useState({
        email: "", senha: "", nome: "", idade: "",
        sexo: "F", urlFotoPerfil: "", // Base64
        especialidade: "", regiao: ""
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    // Lógica da Foto (File -> Base64)
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => setForm(prev => ({ ...prev, urlFotoPerfil: reader.result }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                // --- LOGIN ---
                const data = await apiLogin({ email: form.email, senha: form.senha });
                if (data?.token) window.location.reload(); 
                else throw new Error("Credenciais inválidas.");
            } else {
                // --- CADASTRO ---
                const payload = { ...form };
                if (!isProfessional) { delete payload.especialidade; delete payload.regiao; }
                if (!payload.urlFotoPerfil) delete payload.urlFotoPerfil;
                payload.idade = parseInt(payload.idade); // Garante número

                await apiRegister(payload);
                alert("Conta criada com sucesso! Faça login.");
                setIsLogin(true);
            }
        } catch (error) {
            alert("Erro: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full sm:max-h-[95vh] max-h-screen">
                
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-2xl font-bold text-pink-600">
                        {isLogin ? "Bem-vindo(a)!" : "Crie sua conta"}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {!isLogin && (
                            <>
                                {/* --- FOTO DE PERFIL --- */}
                                <div className="flex flex-col items-center gap-2 mb-4">
                                    <label className="cursor-pointer group relative">
                                        <div className="w-24 h-24 rounded-full border-4 border-pink-200 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                            {preview ? (
                                                <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-3xl text-gray-300">📷</span>
                                            )}
                                        </div>
                                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                        <div className="absolute bottom-0 right-0 bg-pink-600 text-white p-1 rounded-full text-xs shadow-md border-2 border-white">➕</div>
                                    </label>
                                    <span className="text-xs text-gray-500">Adicionar foto</span>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
                                    <input type="text" name="nome" onChange={handleChange} required className="input-padrao" />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Idade</label>
                                        <input type="number" name="idade" onChange={handleChange} required className="input-padrao" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Sexo</label>
                                        <select name="sexo" onChange={handleChange} className="input-padrao">
                                            <option value="F">Feminino</option>
                                            <option value="M">Masculino</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="p-4 bg-pink-50 dark:bg-gray-800 rounded-xl border border-pink-100 dark:border-gray-700 mt-4">
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input type="checkbox" checked={isProfessional} onChange={() => setIsProfessional(!isProfessional)} className="w-5 h-5 accent-pink-600" />
                                        <span className="font-semibold text-pink-700 dark:text-pink-400">Sou Manicure / Profissional</span>
                                    </label>
                                    {isProfessional && (
                                        <div className="mt-4 space-y-3 animate-fadeIn">
                                            <input type="text" name="especialidade" placeholder="Especialidade" onChange={handleChange} className="input-padrao" />
                                            <input type="text" name="regiao" placeholder="Região" onChange={handleChange} className="input-padrao" />
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                        
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                            <input type="email" name="email" onChange={handleChange} required className="input-padrao" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
                            <input type="password" name="senha" onChange={handleChange} required className="input-padrao" />
                        </div>
                        
                        <button type="submit" disabled={loading}
                            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-[1.02] transition disabled:opacity-50 mt-4">
                            {loading ? "Processando..." : (isLogin ? "Entrar" : "Criar Conta")}
                        </button>
                    </form>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700 text-center flex-shrink-0">
                    <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-gray-600 dark:text-gray-300 hover:text-pink-600 font-medium">
                        {isLogin ? "Não tem conta? Cadastre-se grátis!" : "Já tem conta? Faça login."}
                    </button>
                </div>
            </div>
            <style jsx>{`
                .input-padrao {
                    width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #ddd;
                    outline: none; background: white; color: black;
                }
                .input-padrao:focus { border-color: #ec4899; ring: 2px; }
                @media (prefers-color-scheme: dark) {
                    .input-padrao { background: #1f2937; border-color: #374151; color: white; }
                }
            `}</style>
        </div>
    );
}
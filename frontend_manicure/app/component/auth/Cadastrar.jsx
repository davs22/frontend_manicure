"use client";

import { useState } from "react";
// Assumindo que o apiRegister existe no caminho correto
import { apiRegister } from "../../utils/api";

export default function Cadastrar({ onSuccess }) {
  // 1. ESTADOS BASE (Obrigatórios para qualquer usuário)
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");
  const [urlFotoPerfil, setUrlFotoPerfil] = useState("");
  const [sexo, setSexo] = useState("F"); // Padrão "F" para satisfazer a restrição NOT NULL no backend

  // 2. ESTADOS CONDICIONAIS (Apenas para Manicure)
  const [isManicure, setIsManicure] = useState(false);
  const [especialidade, setEspecialidade] = useState("");
  const [regiao, setRegiao] = useState("");

  // 3. ESTADOS DE INTERFACE
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // --- VALIDAÇÕES ---
    if (senha !== senha2) {
      setError("As senhas não conferem.");
      return;
    }
    if (isManicure && (!especialidade || !regiao)) {
      setError("Como manicure, preencha sua especialidade e região.");
      return;
    }
    // -----------------

    setLoading(true);

    // --- CONSTRUÇÃO DINÂMICA DO OBJETO ---
    const baseData = {
      nome,
      idade: parseInt(idade), // O backend JPA espera Integer, enviar como Number/Int
      email,
      senha,
      urlFotoPerfil,
      sexo // Enviando "F" ou "M"
    };

    let finalData = baseData;

    // Inclui dados de complemento se for manicure
    if (isManicure) {
      finalData = {
        ...baseData,
        especialidade,
        regiao,
      };
    }

    try {
      await apiRegister(finalData);
      onSuccess?.(); // Volta para login
    } catch (err) {
      // Exibe a mensagem de erro da API, ou um padrão
      setError(err.message || "Erro no cadastro. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 h-[80vh]">

      {error && <p className="text-red-500 text-center bg-red-100 p-2 rounded-lg">{error}</p>}

      {/* 1. CAMPOS BASE */}
      <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome Completo"
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500" required />
      <input type="number" value={idade} onChange={(e) => setIdade(e.target.value)} placeholder="Idade"
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500" required />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500" required />
      <input type="text" value={urlFotoPerfil} onChange={(e) => setUrlFotoPerfil(e.target.value)} placeholder="URL Foto de Perfil"
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500" />

      {/* Sexo (Dropdown para enviar F ou M) */}
      <select value={sexo} onChange={(e) => setSexo(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 " required>
        <option value="F">Feminino</option>
        <option value="M">Masculino</option>
      </select>

      {/* Senhas */}
      <input
        type="password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        placeholder="Senha"
        // 💡 Adicionado autocomplete para evitar sugestões do navegador
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
        autoComplete="new-password"
        required
      />
      <input
        type="password"
        value={senha2}
        onChange={(e) => setSenha2(e.target.value)}
        placeholder="Confirmar senha"
        // 💡 Adicionado autocomplete para evitar sugestões do navegador
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
        autoComplete="new-password"
        required
      />

      {/* 2. CHECKBOX CONDICIONAL */}
      <div className="flex items-center mt-[1px]">
        <input
          type="checkbox"
          id="isManicure"
          checked={isManicure}
          onChange={(e) => setIsManicure(e.target.checked)}
          // Estilização do checkbox
          className="mr-2 h-5 w-5 text-pink-600 border-gray-300 rounded-lg focus:ring-pink-500"
        />
        <label htmlFor="isManicure" className="text-gray-700 dark:text-gray-300 font-medium cursor-pointer">
          Eu sou uma Manicure profissional
        </label>
      </div>

      {/* 3. CAMPOS EXTRAS DA MANICURE (RENDERIZAÇÃO CONDICIONAL) */}
      {isManicure && (
        <div className="flex flex-col gap-3 mt-[1px] p-4 border border-pink-400 rounded-xl bg-pink-50 dark:bg-pink-900/10 transition-all ">
          <h4 className="font-semibold text-pink-700 dark:text-pink-300">Detalhes Profissionais</h4>
          <input
            type="text"
            value={especialidade}
            onChange={(e) => setEspecialidade(e.target.value)}
            placeholder="Especialidade (ex: Manicure artística)"
            className="w-full p-3 border border-pink-300 rounded-lg focus:ring-pink-600 focus:border-pink-600"
            required={isManicure}
          />
          <input
            type="text"
            value={regiao}
            onChange={(e) => setRegiao(e.target.value)}
            placeholder="Região de Atendimento (ex: Centro)"
            className="w-full p-3 border border-pink-300 rounded-lg focus:ring-pink-600 focus:border-pink-600"
            required={isManicure}
          />
        </div>
      )}

      {/* BOTÃO SUBMIT */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-pink-600 text-white p-3 rounded-lg font-semibold hover:bg-pink-700 transition mt-[1px] shadow-lg shadow-pink-500/30 disabled:bg-gray-400 disabled:shadow-none"
      >
        {loading ? "Enviando..." : "Cadastrar"}
      </button>
    </form>
  );
}
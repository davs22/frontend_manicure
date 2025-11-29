"use client";

import { useState } from "react";
import { apiLogin } from "../../utils/api";

export default function Login({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiLogin({ email, senha });
      if (!data.token) throw new Error("Login falhou");
      onSuccess?.();
    } catch (err) {
      setError(err.message || "Erro ao logar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {error && <p className="text-red-500 text-center">{error}</p>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-3 border rounded-lg"
        required
      />
      <input
        type="password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        placeholder="Senha"
        className="w-full p-3 border rounded-lg"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-pink-600 text-white p-3 rounded-lg"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}

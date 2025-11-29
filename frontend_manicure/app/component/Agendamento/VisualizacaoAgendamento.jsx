"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiGetAgendamentoById } from "../../utils/api";

export default function AgendamentoVisualizacao() {
  const params = useParams();
  const router = useRouter();
  const agendamentoId = params.id;

  const [agendamento, setAgendamento] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAgendamento() {
      try {
        const data = await apiGetAgendamentoById(agendamentoId);
        setAgendamento(data);
      } catch (err) {
        alert("Erro ao carregar agendamento: " + err.message);
      } finally {
        setLoading(false);
      }
    }
    loadAgendamento();
  }, [agendamentoId]);

  if (loading) return <p style={styles.loading}>Carregando...</p>;
  if (!agendamento) return <p style={styles.loading}>Agendamento não encontrado.</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Visualização do Agendamento</h2>

      <div style={styles.card}>
        <p><strong>Serviço:</strong> {agendamento.servico}</p>
        <p><strong>Data:</strong> {agendamento.data}</p>
        <p><strong>Horário:</strong> {agendamento.horario}</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "450px",
    margin: "40px auto",
    padding: "20px",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  card: {
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#fff",
    boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
  },
  loading: {
    textAlign: "center",
    marginTop: "50px",
  },
};

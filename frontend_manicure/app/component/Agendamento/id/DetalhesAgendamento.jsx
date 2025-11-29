"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiGetAgendamentoById } from "../../../utils/api";

export default function AgendamentoDetalhes() {
  const params = useParams();
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

  if (loading) return <p>Carregando...</p>;
  if (!agendamento) return <p>Agendamento não encontrado.</p>;

  // 💡 Se o backend não tiver "status", definimos "agendado" como padrão
  const status = agendamento.status || "AGENDADO";

  // 💡 Estilo de cor baseado no status
  const statusColor = {
    AGENDADO: "blue",
    CONCLUIDO: "green",
    CANCELADO: "red",
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Detalhes do Agendamento</h2>

      <p><strong>Descrição:</strong> {agendamento.descricao}</p>
      <p><strong>Status:</strong> 
        <span style={{ color: statusColor[status], fontWeight: "bold" }}>
          {status}
        </span>
      </p>
      <p><strong>Data:</strong> {agendamento.data}</p>
      <p><strong>Horário:</strong> {agendamento.hora}</p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "40px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#fff",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  }
};

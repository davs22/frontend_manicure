"use client";
import React, { useEffect, useState } from "react";
import { apiGetAgendamento } from "../../utils/api";
import { useRouter } from "next/navigation";

export default function AgendamentoLista() {
  const router = useRouter();
  const [agendamento, setAgendamento] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAgendamento() {
      try {
        const data = await apiGetAgendamento();
        setAgendamento(data);
      } catch (err) {
        console.error(err);
        alert("Erro ao carregar agendamentos: " + err.message);
      } finally {
        setLoading(false);
      }
    }

    loadAgendamento();
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "40px" }}>Carregando agendamentos...</p>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Meus Agendamentos</h2>

      {agendamento.length === 0 && (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Nenhum agendamento encontrado.
        </p>
      )}

      <div style={styles.list}>
        {agendamento.map((appt) => (
          <div
            key={appt.idAgendamento}
            style={styles.card}
            onClick={() => router.push(`/agendamentos/${appt.idAgendamento}`)}
          >
            <h3 style={styles.servico}>{appt.descricao}</h3>

            <p><strong>Data:</strong> {appt.data}</p>
            <p><strong>Horário:</strong> {appt.hora}</p>

            {appt.observacoes && (
              <p style={styles.obs}>
                <strong>Obs:</strong> {appt.observacoes}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Estilos simples
const styles = {
  container: {
    maxWidth: "700px",
    margin: "40px auto",
    padding: "20px",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  card: {
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#fff",
    cursor: "pointer",
    transition: "0.3s",
  },
  servico: {
    marginBottom: "5px",
  },
  obs: {
    fontSize: "14px",
    marginTop: "5px",
    opacity: 0.8,
  },
};

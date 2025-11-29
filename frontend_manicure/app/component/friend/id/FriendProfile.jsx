
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AmigoDetalhes from "../component/friend/AmigoDetalhes";

function FriendProfile() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Caso o usuário entre na página diretamente sem state
  if (!state || !state.friend) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Amigo não encontrado</h2>
        <button onClick={() => navigate(-1)}>Voltar</button>
      </div>
    );
  }

  const friend = state.friend;

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        background: "#fafafa"
      }}
    >
      <button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
        ⬅ Voltar
      </button>

      <div style={{ textAlign: "center" }}>
        <img
          src={friend.avatarUrl}
          alt={friend.nome}
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            objectFit: "cover"
          }}
        />
        <h2>{friend.nome}</h2>
        <p>
          <strong>Idade:</strong> {friend.idade}
        </p>
        <p>
          <strong>Sexo:</strong> {friend.sexo}
        </p>
        <p>
          <strong>Status:</strong> {friend.status}
        </p>
      </div>

      <hr />

      <div>
        <h3>Especializações</h3>
        <ul>
          {friend.especializacoes?.map((esp, index) => (
            <li key={index}>{esp}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Avaliação</h3>
        <p>⭐ {friend.avaliacao} / 5.0</p>
      </div>

      <div>
        <h3>Descrição profissional</h3>
        <p>{friend.descricao}</p>
      </div>

      {friend.fotos && friend.fotos.length > 0 && (
        <div>
          <h3>Fotos de trabalho</h3>
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginTop: "10px"
            }}
          >
            {friend.fotos.map((foto, index) => (
              <img
                key={index}
                src={foto}
                alt="Foto de trabalho"
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "10px",
                  objectFit: "cover"
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FriendProfile;


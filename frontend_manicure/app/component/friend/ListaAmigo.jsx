import React from 'react';

function FriendItem({ friend }) {

  const statusStyle = {
    color: friend.status === 'Online' ? 'green' : 'gray'
  };

  return (
    <div
      className="friend-card"
      style={{
        border: '1px solid #ccc',
        margin: '10px',
        padding: '10px',
        borderRadius: '8px'
      }}
    >
      <img
        src={friend.avatarUrl}
        alt={`Avatar de ${friend.nome}`}
        style={{ width: '50px', height: '50px', borderRadius: '50%' }}
      />

      <h3>{friend.nome}</h3>
      <p>
        Status: <span style={statusStyle}>{friend.status}</span>
      </p>

      {/* Você pode adicionar um botão aqui, como "Ver Perfil" ou "Enviar Mensagem" */}
    </div>
  );
}

export default FriendItem;

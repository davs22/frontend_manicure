import React from 'react';

function AmigoDetalhes({ amigo }) {
  return (
    <div className="amigo-item">
      {/* Imagem do Avatar */}
      <img 
        src={amigo.avatar}
        alt={`Avatar de ${amigo.nome}`}
        className="amigo-avatar"
      />

      {/* Informações */}
      <div className="amigo-info">
        <span className="amigo-nome">{amigo.nome}</span>
        <p className="amigo-status">{amigo.status}</p>
        <p className="amigo-especializacao">Especialização: {amigo.especializacao}</p>
        <p className="amigo-idade">Idade: {amigo.idade}</p>
      </div>
    </div>  
  );
}

export default AmigoDetalhes;

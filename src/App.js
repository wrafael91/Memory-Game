import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [disabled, setDisabled] = useState(false);

  // Array de emojis para las cartas
  const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

  // Inicializar el juego
  const initializeGame = () => {
    const duplicatedEmojis = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, content: emoji, isFlipped: false }));

    setCards(duplicatedEmojis);
    setFlipped([]);
    setMatched([]);
    setDisabled(false);
  };

  // Manejar el clic en una carta
  const handleCardClick = (id) => {
    // Aquí está la corrección: removimos 'card.id' y usamos solo 'id'
    if (disabled || flipped.includes(id) || matched.includes(id)) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);

      if (firstCard.content === secondCard.content) {
        setMatched([...matched, firstId, secondId]);
        setFlipped([]);
        setDisabled(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  // Inicializar el juego al cargar
  useEffect(() => {
    initializeGame();
  }, []);

  return (
    <div className="game-container">
      <h1 className="title">Juego de Memoria</h1>
      <div className="grid">
        {cards.map(card => (
          <div
            key={card.id}
            className={`card ${flipped.includes(card.id) || matched.includes(card.id) ? 'flipped' : ''}`}
            onClick={() => handleCardClick(card.id)}
          >
            {flipped.includes(card.id) || matched.includes(card.id) ? card.content : '?'}
          </div>
        ))}
      </div>
      <button className="reset-button" onClick={initializeGame}>
        Reiniciar Juego
      </button>
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [score, setScore] = useState(0); // Estado para la puntuación

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
    setScore(0); // Reiniciar la puntuación al reiniciar el juego
  };

  // Manejar el clic en una carta
  const handleCardClick = (id) => {
    if (disabled || flipped.includes(id) || matched.includes(id)) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);

      if (firstCard.content === secondCard.content) {
        // Sumar puntos si las cartas coinciden
        setScore((currentScore) => currentScore + 10);
        setMatched((currentMatched) => [...currentMatched, firstId, secondId]);
        setFlipped([]);
        setDisabled(false);
      } else {
        // Restar puntos si las cartas no coinciden
        setTimeout(() => {
          setScore((currentScore) => Math.max(0, currentScore - 2)); // Evitar puntuaciones negativas
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
      {/* Mostrar la puntuación */}
      <div className="score-container">
        <p className="score">Puntuación: {score}</p>
      </div>
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
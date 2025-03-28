import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [disabled, setDisabled] = useState(false);
  // Nuevo estado para la puntuación
  const [score, setScore] = useState(0);

  const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

  const initializeGame = () => {
    const duplicatedEmojis = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, content: emoji, isFlipped: false }));

    setCards(duplicatedEmojis);
    setFlipped([]);
    setMatched([]);
    setDisabled(false);
    // Reiniciar la puntuación
    setScore(0);
  };

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
        // Sumar 10 puntos por encontrar un par
        setScore(currentScore => currentScore + 10);
        setMatched([...matched, firstId, secondId]);
        setFlipped([]);
        setDisabled(false);
      } else {
        // Restar 2 puntos por equivocarse
        setScore(currentScore => Math.max(0, currentScore - 2));
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

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
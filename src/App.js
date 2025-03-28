import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(90); // Comenzamos con 90 segundos
  const [isActive, setIsActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

  const initializeGame = () => {
    const duplicatedEmojis = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, content: emoji, isFlipped: false }));

    setCards(duplicatedEmojis);
    setFlipped([]);
    setMatched([]);
    setDisabled(false);
    setScore(0);
    setTime(90); // Reiniciar el tiempo a 90 segundos
    setIsActive(true);
    setGameOver(false);
    setGameStarted(true);
  };

  // Función para obtener el texto del botón según el estado del juego
  const getButtonText = () => {
    if (!gameStarted) return "Start Game";
    if (gameOver) return "Play again";
    return "Restart game";
  };

  const handleCardClick = (id) => {
    if (disabled || flipped.includes(id) || matched.includes(id) || gameOver) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);

      if (firstCard.content === secondCard.content) {
        setScore((prevScore) => prevScore + 10);
        setMatched((prevMatched) => [...prevMatched, firstId, secondId]);
        setFlipped([]);
        setDisabled(false);
      } else {
        setTimeout(() => {
          setScore((prevScore) => Math.max(0, prevScore - 2));
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  // Efecto para el temporizador
  useEffect(() => {
    let intervalId;

    if (isActive && time > 0) {
      intervalId = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            setIsActive(false);
            setGameOver(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isActive, time]);

  // Efecto para verificar victoria
  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setIsActive(false);
      setGameOver(true);
    }
  }, [matched, cards.length]);

  // Función para formatear el tiempo en mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-container">
      <h1 className="title">Memory Game</h1>
      
      {/* Solo mostrar stats si el juego ha comenzado */}
      {gameStarted && (
        <div className="stats-container">
          <div className="score-container">
            <p className="score">Score: {score}</p>
          </div>
          <div className={`timer-container ${time <= 10 ? 'timer-warning' : ''}`}>
            <p className="timer">Time: {formatTime(time)}</p>
          </div>
        </div>
      )}

      {/* Mostrar mensaje de bienvenida si el juego no ha comenzado */}
      {!gameStarted && (
        <div className="welcome-message">
          <p>Welcome to the Memory Game!</p>
          <p>Find all pairs of cards before time runs out.</p>
          <p>You have 90 seconds to complete the challenge.</p>
        </div>
      )}

      {gameOver && (
        <div className="game-over-message">
          {matched.length === cards.length ? (
            <p className="win-message">Congratulations! You've won with {score} points</p>
          ) : (
            <p className="lose-message">Time's up! Final score: {score}</p>
          )}
        </div>
      )}

      {/* Solo mostrar el grid si el juego ha comenzado */}
      {gameStarted && (
        <div className="grid">
          {cards.map(card => (
            <div
              key={card.id}
              className={`card ${flipped.includes(card.id) || matched.includes(card.id) ? 'flipped' : ''} 
                         ${gameOver ? 'disabled' : ''}`}
              onClick={() => handleCardClick(card.id)}
            >
              {flipped.includes(card.id) || matched.includes(card.id) ? card.content : '?'}
            </div>
          ))}
        </div>
      )}

      <button 
        className="reset-button"
        onClick={initializeGame}
      >
        {getButtonText()}
      </button>
    </div>
  );
}

export default App;
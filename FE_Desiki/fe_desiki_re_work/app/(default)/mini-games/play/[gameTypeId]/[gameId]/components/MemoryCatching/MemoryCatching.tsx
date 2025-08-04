"use client";
import { useState, useEffect, useCallback } from "react";
import "./styles.css";

type GameConfigJson = {
  backCoverImg: string; //Image URL for the back of Card
  originalPoint: number; //Points at the begin
  minusPoint: number; //Số điểm sẽ trừ sau khi chơi hết số lượt chơi an toàn
  numOfPairs: number; //Số cặp thẻ, cũng là số lần chọi an toàn
  pairs: {
    id: number; //index 1-2-3-4-...
    imageBase64: string; //Base64 image data for the card front
  }[];
};

interface Card {
  id: string;
  pairId: number;
  imageBase64: string;
  isFlipped: boolean;
  isMatched: boolean;
}

type GameEvent = {
  gameEvent: {
    _id: string;
    balancePoints: number;
    configJson: GameConfigJson;
    eventName: string;
    gameName: string;
    gameTypeId: number;
    imageUrl: string;
    description: string;
    isDeactivated: boolean;
    endDate: string; //Format: "2023-10-31T23:59:59.999Z"
    startDate: string; //Format: "2023-10-01T00:00:00.000Z"
    createdAt: string; //Format: "2023-10-01T00:00:00.000Z"
    updatedAt: string; //Format: "2023-10-01T00:00:00.000Z"
  };
  gameEventRewardResults: any;
  gameTypeImageUrls: {
    id: string; //index 1-2-3-4-...
    imageUrl: string;
  }[];
};

interface Props {
  gameEvent: GameEvent;
  onFinish: (finalPoints: number) => void;
  autoStart?: boolean;
}

export const MemoryCatchingGame = ({
  gameEvent,
  onFinish,
  autoStart = false,
}: Props) => {
  // STATES
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [safeTurnsLeft, setSafeTurnsLeft] = useState(0);
  const [totalTurns, setTotalTurns] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const config = gameEvent.gameEvent.configJson;

  // Initialize game
  const initializeGame = useCallback(() => {
    console.log("=== MEMORY GAME INITIALIZATION ===");
    console.log("Config:", config);
    console.log("Original points:", config.originalPoint);
    console.log("Minus points:", config.minusPoint);
    console.log("Number of pairs:", config.numOfPairs);
    console.log("GameTypeImageUrls:", gameEvent.gameTypeImageUrls);

    // Create pairs of cards
    const gameCards: Card[] = [];

    config.pairs.forEach((pair, index) => {
      // Get image from gameTypeImageUrls by index
      const imageFromUrls = gameEvent.gameTypeImageUrls[index];

      console.log(`Pair ${pair.id} (index ${index}):`, imageFromUrls);

      // Use imageUrl from gameTypeImageUrls, no fallback to base64
      const imageUrl = imageFromUrls?.imageUrl;

      if (!imageUrl) {
        console.error(
          `No imageUrl found for pair ${pair.id} at index ${index}`
        );
        return;
      }

      console.log(`Using imageUrl for pair ${pair.id}:`, imageUrl);

      // Add two cards for each pair
      gameCards.push({
        id: `${pair.id}-1`,
        pairId: pair.id,
        imageBase64: imageUrl, // This is now imageUrl, not base64
        isFlipped: false,
        isMatched: false,
      });
      gameCards.push({
        id: `${pair.id}-2`,
        pairId: pair.id,
        imageBase64: imageUrl, // This is now imageUrl, not base64
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle cards
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);

    setCards(shuffledCards);
    setCurrentPoints(config.originalPoint);
    setSafeTurnsLeft(config.numOfPairs);
    setMatchedPairs(0);
    setTotalTurns(0);
    setIsGameStarted(true);
    setIsGameOver(false);

    console.log("Game initialized with points:", config.originalPoint);
    console.log("Total cards created:", shuffledCards.length);
    console.log("=====================================");
  }, [config, gameEvent.gameTypeImageUrls]);

  // Auto start game if autoStart prop is true
  useEffect(() => {
    if (autoStart && !isGameStarted) {
      initializeGame();
    }
  }, [autoStart, isGameStarted, initializeGame]);

  // Handle card click
  const handleCardClick = useCallback(
    (cardId: string) => {
      if (isAnimating || isGameOver) return;

      const card = cards.find((c) => c.id === cardId);
      if (!card || card.isFlipped || card.isMatched) return;

      if (flippedCards.length >= 2) return;

      setCards((prev) =>
        prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c))
      );

      setFlippedCards((prev) => [...prev, cardId]);
    },
    [cards, flippedCards, isAnimating, isGameOver]
  );

  // Check for matches
  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsAnimating(true);

      // Count 1 turn = 2 cards flipped (one complete attempt) - do this first
      setTotalTurns((prev) => prev + 1);
      if (safeTurnsLeft > 0) {
        setSafeTurnsLeft((prev) => prev - 1);
      }

      const [firstId, secondId] = flippedCards;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        // Match found!
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isMatched: true }
                : c
            )
          );
          setMatchedPairs((prev) => prev + 1);
          setFlippedCards([]);
          setIsAnimating(false);
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isFlipped: false }
                : c
            )
          );

          // Deduct points if not in safe turns (using the old safeTurnsLeft value)
          if (safeTurnsLeft <= 1) {
            setCurrentPoints((prev) => Math.max(0, prev - config.minusPoint));
          }

          setFlippedCards([]);
          setIsAnimating(false);
        }, 1500);
      }
    }
  }, [flippedCards.length]);

  // Check game over conditions
  useEffect(() => {
    // Only check game over if game has started
    if (!isGameStarted || isGameOver) return;

    if (matchedPairs === config.numOfPairs) {
      // All pairs matched - game won!
      setIsGameOver(true);
      setTimeout(() => {
        onFinish(currentPoints);
      }, 1000);
    } else if (currentPoints <= 0 && totalTurns > 0) {
      // No points left - game over! (but only after at least one turn)
      setIsGameOver(true);
      setTimeout(() => {
        onFinish(0);
      }, 1000);
    }
  }, [
    matchedPairs,
    currentPoints,
    config.numOfPairs,
    onFinish,
    isGameStarted,
    isGameOver,
    totalTurns,
  ]);

  // Calculate grid layout
  const getGridCols = () => {
    const totalCards = config.numOfPairs * 2;
    if (totalCards <= 8) return 4;
    if (totalCards <= 12) return 4;
    if (totalCards <= 16) return 4;
    return 6;
  };

  if (!isGameStarted) {
    return (
      <div className="memory-game-container">
        <div className="game-header">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            {gameEvent.gameEvent.eventName}
          </h2>
          <p className="text-gray-500 text-sm">Memory Catching Game</p>
        </div>

        <div className="game-info">
          <div className="info-card">
            <h3>Game Rules</h3>
            <ul>
              <li>Find matching pairs by flipping cards</li>
              <li>You have {config.numOfPairs} safe turns</li>
              <li>Starting points: {config.originalPoint}</li>
              <li>
                After safe turns: -{config.minusPoint} points per wrong match
              </li>
            </ul>
          </div>

          <button className="start-button" onClick={initializeGame}>
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="memory-game-container">
      <div className="game-header">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          {gameEvent.gameEvent.eventName}
        </h2>
        <p className="text-gray-500 text-sm">Memory Catching Game</p>
      </div>

      <div className="game-stats">
        <div className="stat-item">
          <span className="label">Current Points:</span>
          <span className="value points">{currentPoints}</span>
        </div>
        <div className="stat-item">
          <span className="label">Pairs Found:</span>
          <span className="value">
            {matchedPairs} / {config.numOfPairs}
          </span>
        </div>
        <div className="stat-item">
          <span className="label">Safe Turns:</span>
          <span className="value">{safeTurnsLeft}</span>
        </div>
        <div className="stat-item">
          <span className="label">Total Turns:</span>
          <span className="value">{totalTurns}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`card ${
              card.isFlipped || card.isMatched ? "flipped" : ""
            } ${card.isMatched ? "matched" : ""} ${
              isAnimating ? "animating" : ""
            }`}
            onClick={() => handleCardClick(card.id)}
          >
            <div className="card-inner">
              <div className="card-front">
                <img
                  src={config.backCoverImg}
                  alt="Card back"
                  className="card-image"
                />
              </div>
              <div className="card-back">
                <img
                  src={card.imageBase64}
                  alt="Card content"
                  className="card-image"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {isGameOver && (
        <div className="game-over-overlay">
          <div className="game-over-modal">
            <h3>
              {matchedPairs === config.numOfPairs
                ? "🎉 Congratulations!"
                : "😞 Game Over"}
            </h3>
            <p>
              {matchedPairs === config.numOfPairs
                ? `You found all pairs! Final score: ${currentPoints} points`
                : "You ran out of points. Better luck next time!"}
            </p>
            <p className="text-sm text-gray-600">Finishing game...</p>
          </div>
        </div>
      )}
    </div>
  );
};

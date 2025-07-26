import { useState, useEffect } from "react";
import styles from "./MemoryCatching.module.css";

const MemoryCatchingUI = ({
  numOfPairs,
  pairs,
  backCoverImg,
  originalPoint,
  minusPoint,
  onComplete,
  onBack,
}) => {
  const [finalPoints, setFinalPoints] = useState(0);

  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]); // Indices of currently flipped cards
  const [matchedPairsCount, setMatchedPairsCount] = useState(0);
  const [score, setScore] = useState(0);
  const [safeFlipsLeft, setSafeFlipsLeft] = useState(numOfPairs);
  const [gameOver, setGameOver] = useState(false);
  const [canFlip, setCanFlip] = useState(true); // To prevent rapid clicks during flip animation

  useEffect(() => {
    initializeGame();
  }, [numOfPairs, pairs]); // Re-initialize if props change

  useEffect(() => {
    if (matchedPairsCount === numOfPairs && numOfPairs > 0) {
      setGameOver(true);
    }
  }, [matchedPairsCount, numOfPairs]);

  const initializeGame = () => {
    const duplicatedCards = [];
    let uniqueCardId = 0;

    pairs.slice(0, numOfPairs).forEach((pair) => {
      // Create two instances of each pair
      duplicatedCards.push({
        id: uniqueCardId++,
        pairId: pair.id,
        imageBase64: pair.imageBase64,
        isFlipped: false,
        isMatched: false,
      });
      duplicatedCards.push({
        id: uniqueCardId++,
        pairId: pair.id,
        imageBase64: pair.imageBase64,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle the cards
    const shuffledCards = duplicatedCards.sort(() => Math.random() - 0.5);

    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairsCount(0);
    setScore(originalPoint);
    setSafeFlipsLeft(numOfPairs);
    setGameOver(false);
    setCanFlip(true);
  };

  const handleCardClick = (clickedIndex) => {
    if (
      !canFlip ||
      gameOver ||
      cards[clickedIndex].isFlipped ||
      cards[clickedIndex].isMatched
    ) {
      return;
    }

    setCanFlip(false); // Prevent further clicks until current flip sequence is resolved

    const newCards = [...cards];
    newCards[clickedIndex].isFlipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, clickedIndex];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const [firstIndex, secondIndex] = newFlippedCards;

      if (newCards[firstIndex].pairId === newCards[secondIndex].pairId) {
        // Match found
        setTimeout(() => {
          const updatedCards = [...newCards];
          updatedCards[firstIndex].isMatched = true;
          updatedCards[secondIndex].isMatched = true;
          setCards(updatedCards);
          setMatchedPairsCount((prev) => prev + 1);
          setFlippedCards([]);
          setCanFlip(true);
        }, 1000); // Keep cards flipped for 1 second before marking matched
      } else {
        // No match
        setTimeout(() => {
          const updatedCards = [...newCards];
          updatedCards[firstIndex].isFlipped = false;
          updatedCards[secondIndex].isFlipped = false;
          setCards(updatedCards);
          setFlippedCards([]);
          setCanFlip(true);

          setSafeFlipsLeft((prev) => {
            if (prev > 0) {
              return prev - 1;
            } else {
              setScore((currentScore) =>
                Math.max(0, currentScore - minusPoint)
              );
              return prev; // Stays at 0 or negative
            }
          });
        }, 1500); // Keep cards flipped for 1.5 seconds before flipping back
      }
    } else {
      setCanFlip(true); // Allow flipping next card if only one is flipped
    }
  };

  const progressPercentage = (matchedPairsCount / numOfPairs) * 100;

  return (
    <div className={styles.memoryGameContainer}>
      <h2>Memory Catching Game</h2>
      <div className={styles.gameInfo}>
        <p>Score: {score}</p>
        <p>Safe Flips Left: {safeFlipsLeft}</p>
        <div className={styles.progressBarContainer}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p>
          Matched Pairs: {matchedPairsCount} / {numOfPairs}
        </p>
      </div>

      <div className={styles.cardGrid}>
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`${styles.card} ${
              card.isFlipped ? styles.flipped : ""
            } ${card.isMatched ? styles.matched : ""}`}
            onClick={() => handleCardClick(index)}
          >
            <div className={styles.cardInner}>
              <div className={styles.cardFront}>
                <img src={card.imageBase64} alt={`Card ${card.pairId}`} />
              </div>
              <div className={styles.cardBack}>
                <img src={backCoverImg} alt="Card Back" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {gameOver && (
        <div className={styles.gameOverOverlay}>
          <p className={styles.gameOverText}>Game Over!</p>
          <p className={styles.finalScore}>Final Score: {score}</p>
          <button onClick={initializeGame} className={styles.restartButton}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default MemoryCatchingUI;

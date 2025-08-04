import { useState, useEffect } from "react";
import styles from "./MemoryCatching.module.css";

const MemoryCatchingUI = ({
  numOfPairs,
  pairs,
  backCoverImg,
  originalPoint,
  minusPoint,
  onComplete,
  gameEventId,
}) => {
  const [finalPoints, setFinalPoints] = useState(0);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairsCount, setMatchedPairsCount] = useState(0);
  const [score, setScore] = useState(0);
  const [safeFlipsLeft, setSafeFlipsLeft] = useState(numOfPairs);
  const [gameOver, setGameOver] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [canFlip, setCanFlip] = useState(true);

  useEffect(() => {
    initializeGame();
  }, [numOfPairs, pairs]);

  useEffect(() => {
    if (matchedPairsCount === numOfPairs && numOfPairs > 0 && !gameCompleted) {
      setGameOver(true);
      setGameCompleted(true);
      if (onComplete) {
        console.log("Calling onComplete with:", gameEventId, score);
        onComplete(gameEventId, score);
      }
    }
  }, [
    matchedPairsCount,
    numOfPairs,
    score,
    onComplete,
    gameEventId,
    gameCompleted,
  ]);

  const initializeGame = () => {
    const duplicatedCards = [];
    let uniqueCardId = 0;

    pairs.slice(0, numOfPairs).forEach((pair) => {
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

    const shuffledCards = duplicatedCards.sort(() => Math.random() - 0.5);

    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairsCount(0);
    setScore(originalPoint);
    setSafeFlipsLeft(numOfPairs);
    setGameOver(false);
    setGameCompleted(false);
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

    setCanFlip(false);

    const newCards = [...cards];
    newCards[clickedIndex].isFlipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, clickedIndex];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const [firstIndex, secondIndex] = newFlippedCards;

      if (newCards[firstIndex].pairId === newCards[secondIndex].pairId) {
        // Match
        setTimeout(() => {
          const updatedCards = [...newCards];
          updatedCards[firstIndex].isMatched = true;
          updatedCards[secondIndex].isMatched = true;
          setCards(updatedCards);
          setMatchedPairsCount((prev) => prev + 1);
          setFlippedCards([]);
          setCanFlip(true);
        }, 1000);
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
              return prev;
            }
          });
        }, 1500);
      }
    } else {
      setCanFlip(true);
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
    </div>
  );
};

export default MemoryCatchingUI;

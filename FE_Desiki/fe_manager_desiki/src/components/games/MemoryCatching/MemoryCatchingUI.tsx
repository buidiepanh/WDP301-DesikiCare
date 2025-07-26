// import React, { useEffect, useState } from "react";
// import "./styles.css";
// import { Button } from "@mui/material";

// interface Pair {
//   id: number; //Id riêng
//   imageBase64: string; //Ảnh thật của ô đó base64
// }

// type Props = {
//   numOfPairs: number; //Số lượng cặp ô
//   pairs: Pair[]; //Mảng chứa các thông tin của cặp ô
//   backCoverImg: string; //Ảnh nền của tất cả các ô
//   originalPoint: number; //Điểm gốc ban đầu
//   minusPoint: number; //Điểm trừ mỗi lần lật sai, chỉ trừ khi đã quá số lượt an toàn cho phép
// };

// type Card = {
//   id: number;
//   pairId: number;
//   imageBase64: string;
//   flipped: boolean;
//   matched: boolean;
// };

// export const MemoryCatchingUI: React.FC<Props> = ({
//   numOfPairs,
//   pairs,
//   backCoverImg,
//   originalPoint,
//   minusPoint,
// }) => {
//   const [cards, setCards] = useState<Card[]>([]);
//   const [flippedCards, setFlippedCards] = useState<Card[]>([]);
//   const [score, setScore] = useState(originalPoint);
//   const [turns, setTurns] = useState(0);
//   const [gameOver, setGameOver] = useState(false);
//   const [gameResult, setGameResult] = useState<string | null>(null);

//   // Khởi tạo cards
//   useEffect(() => {
//     resetGame();
//   }, [pairs, originalPoint]);

//   useEffect(() => {
//     if (score === 0) {
//       setGameOver(true);
//       setGameResult(`Bạn đã thua!`);
//     } else {
//       if (cards.length > 0 && cards.every((c) => c.matched)) {
//         setGameOver(true);
//         setGameResult(`Chúc mừng bạn đã chiến thắng với ${score} điểm!`);
//       }
//     }
//   }, [cards, score]);

//   const resetGame = () => {
//     const allCards: Card[] = [];
//     pairs.forEach((pair, index) => {
//       // tạo 2 thẻ giống nhau cho mỗi pair
//       allCards.push({
//         id: index * 2,
//         pairId: index,
//         imageBase64: pair.imageBase64,
//         flipped: false,
//         matched: false,
//       });
//       allCards.push({
//         id: index * 2 + 1,
//         pairId: index,
//         imageBase64: pair.imageBase64,
//         flipped: false,
//         matched: false,
//       });
//     });
//     // Xáo trộn ngẫu nhiên
//     allCards.sort(() => Math.random() - 0.5);
//     setCards(allCards);
//     setScore(originalPoint);
//     setTurns(0);
//     setGameOver(false);
//     setGameResult(null);
//     setFlippedCards([]);
//   };

//   const flipCard = (card: Card) => {
//     if (gameOver) return;
//     if (flippedCards.length === 2) return;
//     if (card.flipped || card.matched) return;

//     const updatedCards = cards.map((c) =>
//       c.id === card.id ? { ...c, flipped: true } : c
//     );
//     const newFlipped = [...flippedCards, { ...card, flipped: true }];

//     setCards(updatedCards);
//     setFlippedCards(newFlipped);

//     if (newFlipped.length === 2) {
//       setTurns((prev) => prev + 1);
//       if (turns + 1 > numOfPairs) {
//         setScore((prev) => Math.max(prev - minusPoint, 0));
//       }
//       if (newFlipped[0].pairId === newFlipped[1].pairId) {
//         // Match
//         setTimeout(() => {
//           setCards((prev) =>
//             prev.map((c) =>
//               c.pairId === newFlipped[0].pairId ? { ...c, matched: true } : c
//             )
//           );
//           setFlippedCards([]);
//           checkGameOver();
//         }, 1000);
//       } else {
//         // No match
//         setTimeout(() => {
//           setCards((prev) =>
//             prev.map((c) =>
//               c.id === newFlipped[0].id || c.id === newFlipped[1].id
//                 ? { ...c, flipped: false }
//                 : c
//             )
//           );
//           setFlippedCards([]);
//         }, 1000);
//       }
//     }
//   };

//   const checkGameOver = () => {
//     if (cards.every((c) => c.matched)) {
//       setGameOver(true);
//       setGameResult(`Chúc mừng bạn đã chiến thắng với ${score} điểm!`);
//     }
//   };

//   return (
//     <div>
//       <div className="memory-container">
//         {cards.map((card) => (
//           <div
//             key={card.id}
//             className={`memory-card ${
//               card.flipped || card.matched ? "flipped" : ""
//             }`}
//             onClick={() => flipCard(card)}
//           >
//             <div
//               className={`front rounded-md border-2 ${
//                 card.matched ? "border-yellow-400" : "border-transparent"
//               }`}
//             >
//               <img
//                 className="rounded-sm w-[120px] h-[120px]"
//                 src={card.imageBase64}
//                 alt="front"
//               />
//             </div>
//             <div className="back rounded-md">
//               <img
//                 className="rounded-sm w-[120px] h-[120px]"
//                 src={backCoverImg}
//                 alt="back"
//               />
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="mt-5">
//         <p>Điểm hiện tại: {score}</p>
//         <p>Lượt chơi: {turns}</p>
//         {gameOver && <p className="font-bold">{gameResult}</p>}
//       </div>

//       <div>
//         <Button color="warning" onClick={() => resetGame()}>
//           Reset Game
//         </Button>
//       </div>
//     </div>
//   );
// };

import type React from "react";
import { useState, useEffect } from "react";
import styles from "./MemoryCatchingUI.module.css";

type Pair = {
  id: number;
  imageBase64: string;
};

interface Props {
  numOfPairs: number;
  pairs: Pair[];
  backCoverImg: string;
  originalPoint: number;
  minusPoint: number;
}

interface CardState {
  id: number; // Unique ID for the card instance (not the pair ID)
  pairId: number; // ID of the pair it belongs to
  imageBase64: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryCatchingUI: React.FC<Props> = ({
  numOfPairs,
  pairs,
  backCoverImg,
  originalPoint,
  minusPoint,
}) => {
  const [cards, setCards] = useState<CardState[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]); // Indices of currently flipped cards
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
    const duplicatedCards: CardState[] = [];
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

  const handleCardClick = (clickedIndex: number) => {
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

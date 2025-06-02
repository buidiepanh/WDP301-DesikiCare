import React, { useEffect, useState } from "react";
import "./styles.css";
import { Button } from "@mui/material";

interface Pair {
  img_url: string;
}

type Props = {
  numOfPairs: number;
  pairs: Pair[];
  backCoverImg: string;
  originalPoint: number;
  minusPoint: number;
};

type Card = {
  id: number;
  pairId: number;
  img_url: string;
  flipped: boolean;
  matched: boolean;
};

export const MemoryCatchingUI: React.FC<Props> = ({
  numOfPairs,
  pairs,
  backCoverImg,
  originalPoint,
  minusPoint,
}) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [score, setScore] = useState(originalPoint);
  const [turns, setTurns] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState<string | null>(null);

  // Khởi tạo cards
  useEffect(() => {
    resetGame();
  }, [pairs, originalPoint]);

  useEffect(() => {
    if (score === 0) {
      setGameOver(true);
      setGameResult(`Bạn đã thua!`);
    } else {
      if (cards.length > 0 && cards.every((c) => c.matched)) {
        setGameOver(true);
        setGameResult(`Chúc mừng bạn đã chiến thắng với ${score} điểm!`);
      }
    }
  }, [cards, score]);

  const resetGame = () => {
    const allCards: Card[] = [];
    pairs.forEach((pair, index) => {
      // tạo 2 thẻ giống nhau cho mỗi pair
      allCards.push({
        id: index * 2,
        pairId: index,
        img_url: pair.img_url,
        flipped: false,
        matched: false,
      });
      allCards.push({
        id: index * 2 + 1,
        pairId: index,
        img_url: pair.img_url,
        flipped: false,
        matched: false,
      });
    });
    // Xáo trộn ngẫu nhiên
    allCards.sort(() => Math.random() - 0.5);
    setCards(allCards);
    setScore(originalPoint);
    setTurns(0);
    setGameOver(false);
    setGameResult(null);
    setFlippedCards([]);
  };

  const flipCard = (card: Card) => {
    if (gameOver) return;
    if (flippedCards.length === 2) return;
    if (card.flipped || card.matched) return;

    const updatedCards = cards.map((c) =>
      c.id === card.id ? { ...c, flipped: true } : c
    );
    const newFlipped = [...flippedCards, { ...card, flipped: true }];

    setCards(updatedCards);
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setTurns((prev) => prev + 1);
      if (turns + 1 > numOfPairs) {
        setScore((prev) => Math.max(prev - minusPoint, 0));
      }
      if (newFlipped[0].pairId === newFlipped[1].pairId) {
        // Match
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.pairId === newFlipped[0].pairId ? { ...c, matched: true } : c
            )
          );
          setFlippedCards([]);
          checkGameOver();
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === newFlipped[0].id || c.id === newFlipped[1].id
                ? { ...c, flipped: false }
                : c
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const checkGameOver = () => {
    if (cards.every((c) => c.matched)) {
      setGameOver(true);
      setGameResult(`Chúc mừng bạn đã chiến thắng với ${score} điểm!`);
    }
  };

  return (
    <div>
      <div className="memory-container">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`memory-card ${
              card.flipped || card.matched ? "flipped" : ""
            }`}
            onClick={() => flipCard(card)}
          >
            <div
              className={`front rounded-md border-2 ${
                card.matched ? "border-yellow-400" : "border-transparent"
              }`}
            >
              <img className="rounded-sm" src={card.img_url} alt="front" />
            </div>
            <div className="back rounded-md">
              <img className="rounded-sm" src={backCoverImg} alt="back" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <p>Điểm hiện tại: {score}</p>
        <p>Lượt chơi: {turns}</p>
        {gameOver && <p className="font-bold">{gameResult}</p>}
      </div>

      <div>
        <Button color="warning" onClick={() => resetGame()}>
          Reset Game
        </Button>
      </div>
    </div>
  );
};

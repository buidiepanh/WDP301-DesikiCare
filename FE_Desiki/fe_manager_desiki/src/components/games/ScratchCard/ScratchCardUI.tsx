// import React, { useRef, useState } from "react";

// import { Button } from "@mui/material";
// import BackCoverImg from "../../../assets/TestScratch/backCoverImg.jpg";

// type CardConfig = {
//   label: string; //Label của thẻ cào
//   imgBase64: string; //Ảnh thật của thẻ cào dạng base64
//   point: number; //Số điểm thưởng của thẻ
//   text: string; //Màu chữ của thẻ
// }

// interface Props{
//   numCards: number; //Số lượng thẻ
//   cards: CardConfig[]; //Mảng chứa các thẻ
//   backCoverImg: string; //Ảnh nền ban đầu chưa cào của tất cả các thẻ
//   maxScratch: number; //Số lượng thẻ cào cho phép cào
// };

// export const ScratchCardUI: React.FC<Props> = ({
//   numCards,
//   cards,
//   backCoverImg,
//   maxScratch,
// }) => {
//   // State quản lý lượt cào đã dùng, điểm thưởng tích lũy, thẻ đã hoàn thành
//   const [scratchCount, setScratchCount] = useState(0);
//   const [totalPoint, setTotalPoint] = useState(0);
//   const [doneIndices, setDoneIndices] = useState<number[]>([]);
//   console.log("Đây là data JSON của scratch card: ", {
//     numCards: numCards,
//     cards: cards,
//     backCoverImg: backCoverImg,
//     maxScratch: maxScratch,
//   });
//   const onComplete = (index: number, point: number) => {
//     if (doneIndices.includes(index)) return; // tránh trùng
//     setDoneIndices((old) => [...old, index]);
//     setTotalPoint((old) => old + point);
//   };

//   const handleScratch = () => {
//     if (scratchCount >= maxScratch) {
//       alert("Bạn đã dùng hết lượt cào!");
//       return false;
//     }
//     setScratchCount((prev) => prev + 1);
//     return true;
//   };

//   // const handleReset = () => {
//   //   setScratchCount(0);
//   //   setTotalPoint(0);
//   //   setDoneIndices([]);
//   //   refs.current.forEach((ref) => ref?.reset());
//   // };

//   return (
//     <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
//       {cards?.map((card, idx) => (
//         <div key={idx} className="border rounded overflow-hidden relative">
//           {/* <ScratchCard
//             ref={(el) => {
//               refs.current[idx] = el;
//             }}
//             width={320}
//             height={200}
//             image={backCoverImg}
//             finishPercent={60}
//             onComplete={() => onComplete(idx, card.point)}
//             brushSize={30}
//             className="cursor-pointer"
//             onScratch={() => handleScratch()}
//           >
//             <div className="w-full h-full flex flex-col items-center justify-center bg-white relative">
//               <img
//                 src={card.imgBase64}
//                 alt={card.label}
//                 className="w-full h-full object-cover"
//               />
//               <p
//                 style={{ color: card.text }}
//                 className="absolute text-2xl mt-2 font-semibold"
//               >
//                 {card.label}
//               </p>
//             </div>
//           </ScratchCard> */}
//         </div>
//       ))}

//       <div className="col-span-2 mt-4 flex flex-col items-center">
//         <p>
//           Tổng điểm nhận được: <strong>{totalPoint}</strong>
//         </p>
//         <p>
//           Lượt cào: <strong>{scratchCount}</strong> / {maxScratch}
//         </p>
//         {/* <Button
//           variant="outlined"
//           color="error"
//           onClick={handleReset}
//           className="mt-3"
//         >
//           Reset
//         </Button> */}
//       </div>
//     </div>
//   );
// };

import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./ScratchCardUI.module.css";

type CardConfig = {
  label: string;
  imgBase64: string;
  point: number;
  text: string;
};

interface Props {
  numCards: number;
  cards: CardConfig[];
  backCoverImg: string;
  maxScratch: number;
}

interface ScratchCardState extends CardConfig {
  isScratched: boolean;
  revealedPoints: number;
  scratchProgress: number;
  isRevealing: boolean;
}

const ScratchCardUI: React.FC<Props> = ({
  numCards,
  cards: initialCards,
  backCoverImg,
  maxScratch,
}) => {
  const [scratchCards, setScratchCards] = useState<ScratchCardState[]>([]);
  const [scratchesMade, setScratchesMade] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    initializeGame();
  }, [numCards, initialCards, backCoverImg, maxScratch]);

  useEffect(() => {
    if (scratchesMade >= maxScratch && maxScratch > 0) {
      setGameOver(true);
    }
  }, [scratchesMade, maxScratch]);

  const initializeGame = () => {
    const gameCards: ScratchCardState[] = initialCards
      .slice(0, numCards)
      .map((card) => ({
        ...card,
        isScratched: false,
        revealedPoints: 0,
        scratchProgress: 0,
        isRevealing: false,
      }));
    setScratchCards(gameCards);
    setScratchesMade(0);
    setTotalScore(0);
    setGameOver(false);

    // Debug logging
    console.log("ScratchCard initialized with:", {
      numCards,
      cardsCount: gameCards.length,
      backCoverImg: backCoverImg
        ? `${backCoverImg.substring(0, 50)}...`
        : "null",
      maxScratch,
    });
  };

  const ScratchCard: React.FC<{ card: ScratchCardState; index: number }> = ({
    card,
    index,
  }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawing = useRef(false);
    const [isCardScratched, setIsCardScratched] = useState(card.isScratched);
    const [scratchProgress, setScratchProgress] = useState(0);
    const [isRevealing, setIsRevealing] = useState(false);
    const scratchedPixels = useRef(new Set<string>());
    const totalPixels = useRef(0);
    const lastMousePos = useRef({ x: 0, y: 0 });

    // Calculate scratch progress
    const calculateScratchProgress = useCallback(() => {
      if (totalPixels.current === 0) return 0;
      return (scratchedPixels.current.size / totalPixels.current) * 100;
    }, []);

    // Create particle effect
    const createParticle = useCallback((x: number, y: number) => {
      const particle = document.createElement("div");
      particle.className = styles.particle;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;

      const container = canvasRef.current?.parentElement;
      if (container) {
        container.appendChild(particle);
        setTimeout(() => {
          if (container.contains(particle)) {
            container.removeChild(particle);
          }
        }, 1000);
      }
    }, []);

    // Check if card should be fully revealed
    useEffect(() => {
      if (scratchProgress >= 60 && !isCardScratched) {
        setIsRevealing(true);
        setTimeout(() => {
          setIsCardScratched(true);
          setScratchesMade((prev) => prev + 1);
          setTotalScore((prev) => prev + card.point);
          setScratchCards((prevCards) => {
            const newCards = [...prevCards];
            newCards[index] = {
              ...newCards[index],
              isScratched: true,
              revealedPoints: card.point,
              scratchProgress: 100,
              isRevealing: false,
            };
            return newCards;
          });
        }, 500);
      }
    }, [scratchProgress, isCardScratched, card.point, index]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas dimensions based on container size
      const resizeCanvas = () => {
        const container = canvas.parentElement;
        if (container) {
          canvas.width = container.offsetWidth;
          canvas.height = container.offsetHeight;

          // Draw the back cover image if not scratched
          if (!isCardScratched && backCoverImg) {
            const img = new Image();
            img.crossOrigin = "anonymous"; // Important for CORS if image is from different origin
            // Handle both base64 string and data URL formats
            const imageSrc = backCoverImg.startsWith("data:")
              ? backCoverImg
              : `data:image/png;base64,${backCoverImg}`;
            img.src = imageSrc;
            console.log(
              `Loading back cover image for card ${index}:`,
              imageSrc.substring(0, 50) + "..."
            );
            img.onload = () => {
              console.log(
                `Back cover image loaded successfully for card ${index}`
              );
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.onerror = (e) => {
              console.error(`Error loading backCoverImg for card ${index}:`, e);
              // Fallback to a solid color if image fails to load
              ctx.fillStyle = "#ccc";
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            };
          } else if (!isCardScratched) {
            // Fallback if no back cover image
            ctx.fillStyle = "#ddd";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          } else {
            // Clear canvas if already scratched
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }
        }
      };

      // Initial resize and calculate total pixels
      resizeCanvas();
      totalPixels.current = canvas.width * canvas.height;

      // Resize on window resize
      window.addEventListener("resize", resizeCanvas);

      return () => {
        window.removeEventListener("resize", resizeCanvas);
      };
    }, [backCoverImg, isCardScratched, index]);

    const startScratch = useCallback(
      (e: React.MouseEvent | React.TouchEvent) => {
        if (gameOver || isCardScratched || isRevealing) return;
        isDrawing.current = true;

        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        let clientX, clientY;
        if ("touches" in e) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        } else {
          clientX = e.clientX;
          clientY = e.clientY;
        }

        lastMousePos.current = {
          x: clientX - rect.left,
          y: clientY - rect.top,
        };

        draw(e);
      },
      [gameOver, isCardScratched, isRevealing]
    );

    const draw = useCallback(
      (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing.current || gameOver || isCardScratched || isRevealing)
          return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if ("touches" in e) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        } else {
          clientX = e.clientX;
          clientY = e.clientY;
        }

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        // Create smooth brush stroke between last position and current position
        const lastX = lastMousePos.current.x;
        const lastY = lastMousePos.current.y;
        const distance = Math.sqrt((x - lastX) ** 2 + (y - lastY) ** 2);
        const brushSize = 25;

        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = brushSize;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Draw line from last position to current position for smooth scratching
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Create particles along the scratch path
        if (distance > 5) {
          createParticle(
            x + (Math.random() - 0.5) * 10,
            y + (Math.random() - 0.5) * 10
          );
        }

        // Track scratched pixels for progress calculation
        for (let i = 0; i < distance; i += 2) {
          const lerpX = Math.round(lastX + (x - lastX) * (i / distance));
          const lerpY = Math.round(lastY + (y - lastY) * (i / distance));

          for (let dx = -brushSize / 2; dx <= brushSize / 2; dx += 2) {
            for (let dy = -brushSize / 2; dy <= brushSize / 2; dy += 2) {
              const pixelX = lerpX + dx;
              const pixelY = lerpY + dy;
              if (
                pixelX >= 0 &&
                pixelX < canvas.width &&
                pixelY >= 0 &&
                pixelY < canvas.height
              ) {
                scratchedPixels.current.add(
                  `${Math.round(pixelX)},${Math.round(pixelY)}`
                );
              }
            }
          }
        }

        lastMousePos.current = { x, y };

        // Update progress
        const newProgress = calculateScratchProgress();
        setScratchProgress(newProgress);

        ctx.globalCompositeOperation = "source-over";
      },
      [
        gameOver,
        isCardScratched,
        isRevealing,
        createParticle,
        calculateScratchProgress,
      ]
    );

    const endScratch = useCallback(() => {
      isDrawing.current = false;
    }, []);

    return (
      <div
        className={`${styles.scratchCardContainer} ${
          isCardScratched ? styles.scratched : ""
        } ${gameOver ? styles.disabled : ""}`}
      >
        {/* Scratch Progress Indicator */}
        {!isCardScratched && (
          <div className={styles.scratchProgress}>
            <div
              className={styles.scratchProgressBar}
              style={{ width: `${scratchProgress}%` }}
            />
          </div>
        )}

        <div
          className={`${styles.revealedContent} ${
            isCardScratched ? styles.revealed + " " + styles.popping : ""
          }`}
        >
          <img
            src={
              card.imgBase64.startsWith("data:")
                ? card.imgBase64
                : `data:image/png;base64,${card.imgBase64}`
            }
            alt={card.label}
            onLoad={() =>
              console.log(
                `Revealed image loaded for card ${index}:`,
                card.label
              )
            }
            onError={(e) =>
              console.error(
                `Error loading revealed image for card ${index}:`,
                e
              )
            }
          />
          <p className={styles.cardText}>{card.label}</p>
          <p
            className={`${styles.cardPoints} ${
              isCardScratched ? styles.floating : ""
            }`}
          >
            {card.point} pts
          </p>
        </div>

        {/* Particle Container */}
        <div className={styles.scratchParticles}></div>

        {!isCardScratched && !gameOver && (
          <canvas
            ref={canvasRef}
            className={`${styles.scratchCanvas} ${
              isRevealing ? styles.revealing : ""
            }`}
            onMouseDown={startScratch}
            onMouseMove={draw}
            onMouseUp={endScratch}
            onMouseLeave={endScratch}
            onTouchStart={startScratch}
            onTouchMove={draw}
            onTouchEnd={endScratch}
            onTouchCancel={endScratch}
          ></canvas>
        )}
        {gameOver && !isCardScratched && (
          <div className={styles.disabledOverlay}></div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.scratchGameContainer}>
      <h2>Scratch Card Game</h2>
      <div className={styles.gameInfo}>
        <p>Scratches Left: {maxScratch - scratchesMade}</p>
        <p>Total Score: {totalScore}</p>
      </div>

      <div className={styles.cardGrid}>
        {scratchCards.map((card, index) => (
          <ScratchCard key={index} card={card} index={index} />
        ))}
      </div>

      {gameOver && (
        <div className={styles.gameOverOverlay}>
          <p className={styles.gameOverText}>Game Over!</p>
          <p className={styles.finalScore}>Final Score: {totalScore}</p>
          <button onClick={initializeGame} className={styles.restartButton}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default ScratchCardUI;

import { useState, useRef, useEffect } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import styles from "./ScratchCard.module.css";

const ScratchCardUI = ({ gameData, onComplete, onBack }) => {
  // Add error handling
  if (!gameData || !gameData.gameEvent || !gameData.gameEvent.configJson) {
    return (
      <div className={styles.scratchCardContainer}>
        <Typography variant="h6" color="error">
          Lỗi: Không thể tải dữ liệu game
        </Typography>
        <Button onClick={onBack}>Quay lại</Button>
      </div>
    );
  }

  const { gameEvent, gameTypeImageUrls } = gameData;
  const config = gameEvent.configJson;
  const { cards, maxScratch, numOfScratchs } = config;

  // Add validation
  if (!cards || !Array.isArray(cards) || cards.length === 0) {
    return (
      <div className={styles.scratchCardContainer}>
        <Typography variant="h6" color="error">
          Lỗi: Không có thẻ cào nào được cấu hình
        </Typography>
        <Button onClick={onBack}>Quay lại</Button>
      </div>
    );
  }

  const [scratchedCards, setScratchedCards] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [scratchCount, setScratchCount] = useState(0);
  const [scratchProgress, setScratchProgress] = useState({});
  const [isMouseDown, setIsMouseDown] = useState({});

  const canvasRefs = useRef({});

  useEffect(() => {
    // Initialize canvases for each card with timeout for DOM readiness
    if (cards && cards.length > 0) {
      const timer = setTimeout(() => {
        cards.forEach((_, index) => {
          if (canvasRefs.current[index] && !scratchedCards.includes(index)) {
            try {
              initializeCanvas(index);
            } catch (error) {
              console.error(`Error initializing canvas ${index}:`, error);
            }
          }
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [cards, scratchedCards]);

  // Cleanup event listeners on unmount
  useEffect(() => {
    return () => {
      try {
        Object.keys(canvasRefs.current).forEach((index) => {
          const canvas = canvasRefs.current[index];
          if (canvas) {
            // Clear all event handlers
            canvas.onmousedown = null;
            canvas.onmouseup = null;
            canvas.onmousemove = null;
            canvas.onmouseleave = null;
            canvas.ontouchstart = null;
            canvas.ontouchend = null;
            canvas.ontouchmove = null;
          }
        });
      } catch (error) {
        console.error("Error during cleanup:", error);
      }
    };
  }, []);

  const initializeCanvas = (cardIndex) => {
    const canvas = canvasRefs.current[cardIndex];
    if (!canvas) return;

    try {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas size
      canvas.width = 200;
      canvas.height = 250;

      // Create scratch layer
      ctx.fillStyle = "#silver";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add scratch texture
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      gradient.addColorStop(0, "#c0c0c0");
      gradient.addColorStop(0.5, "#silver");
      gradient.addColorStop(1, "#a0a0a0");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add text overlay
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "white";
      ctx.font = "bold 16px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Cào để mở", canvas.width / 2, canvas.height / 2 - 10);
      ctx.font = "12px Arial";
      ctx.fillText("🎫", canvas.width / 2, canvas.height / 2 + 15);
    } catch (error) {
      console.error("Error initializing canvas:", error);
    }
  };

  const handleScratch = (e, cardIndex) => {
    if (scratchedCards.includes(cardIndex) || scratchCount >= maxScratch)
      return;

    const canvas = canvasRefs.current[cardIndex];
    if (!canvas) return;

    try {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      let x, y;

      if (e.type.includes("touch")) {
        if (e.touches && e.touches.length > 0) {
          x = e.touches[0].clientX - rect.left;
          y = e.touches[0].clientY - rect.top;
        } else {
          return;
        }
      } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      }

      // Scale coordinates to canvas size
      x = (x / rect.width) * canvas.width;
      y = (y / rect.height) * canvas.height;

      // Scratch effect
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, 2 * Math.PI);
      ctx.fill();

      // Calculate scratch percentage
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let transparentPixels = 0;

      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) transparentPixels++;
      }

      const totalPixels = canvas.width * canvas.height;
      const scratchPercentage = (transparentPixels / totalPixels) * 100;

      // Update progress
      setScratchProgress((prev) => ({
        ...prev,
        [cardIndex]: Math.min(scratchPercentage, 100),
      }));

      // If scratched more than 80%, reveal the card
      if (scratchPercentage >= 80 && !scratchedCards.includes(cardIndex)) {
        handleCardReveal(cardIndex);
      }
    } catch (error) {
      console.error("Error during scratching:", error);
    }
  };

  const handleCardReveal = (cardIndex) => {
    try {
      const card = cards[cardIndex];
      if (!card) {
        console.error("Card not found at index:", cardIndex);
        return;
      }

      setScratchedCards((prev) => [...prev, cardIndex]);
      setTotalPoints((prev) => prev + (card.point || 0));
      setScratchCount((prev) => prev + 1);

      // Hide canvas
      const canvas = canvasRefs.current[cardIndex];
      if (canvas) {
        canvas.style.display = "none";
      }
    } catch (error) {
      console.error("Error revealing card:", error);
    }
  };

  const handleMouseDown = (cardIndex) => {
    setIsMouseDown((prev) => ({ ...prev, [cardIndex]: true }));
  };

  const handleMouseUp = (cardIndex) => {
    setIsMouseDown((prev) => ({ ...prev, [cardIndex]: false }));
  };

  const handleMouseMove = (e, cardIndex) => {
    if (isMouseDown[cardIndex]) {
      handleScratch(e, cardIndex);
    }
  };

  const handleTouchMove = (e, cardIndex) => {
    e.preventDefault();
    handleScratch(e, cardIndex);
  };

  const handleComplete = () => {
    onComplete(gameEvent._id, totalPoints);
  };

  const isGameComplete = scratchCount >= maxScratch;

  return (
    <div className={styles.scratchCardContainer}>
      <div className={styles.gameHeaderBtn}>
        <Button
          startIcon={<ArrowBack />}
          onClick={onBack}
          className={styles.backButton}
          variant="outlined"
        >
          Quay lại
        </Button>
      </div>

      <div className={styles.gameHeader}>
        <Typography variant="h4" gutterBottom>
          {gameEvent.gameName}
        </Typography>
        {/* <Typography variant="subtitle1">{gameEvent.eventName}</Typography> */}
      </div>

      <div className={styles.gameStats}>
        <div className={styles.statItem}>
          <div className={styles.statValue}>
            {scratchCount}/{maxScratch}
          </div>
          <div className={styles.statLabel}>Thẻ đã cào</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{totalPoints}</div>
          <div className={styles.statLabel}>Tổng điểm</div>
        </div>
        {/* <div className={styles.statItem}>
          <div className={styles.statValue}>{numOfScratchs}</div>
          <div className={styles.statLabel}>Tổng số thẻ</div>
        </div> */}
      </div>

      <div className={styles.scratchCardsContainer}>
        {cards.map((card, index) => {
          const isScratched = scratchedCards.includes(index);
          const cardImage =
            gameTypeImageUrls.find((img) => img.id === index)?.imageUrl ||
            card.img;
          const progress = scratchProgress[index] || 0;

          return (
            <div
              key={index}
              className={`${styles.scratchCard} ${
                isScratched ? styles.scratched : ""
              }`}
            >
              {/* Card content (only show when fully revealed) */}
              {isScratched && (
                <div
                  className={styles.cardContent}
                  style={{
                    backgroundImage: `url(${cardImage})`,
                  }}
                >
                  <div className={styles.cardReward}>
                    <div className={styles.rewardLabel}>{card.label}</div>
                    <div className={styles.rewardPoints}>
                      +{card.point} điểm
                    </div>
                  </div>
                </div>
              )}

              {/* Scratch canvas overlay */}
              {!isScratched && (
                <>
                  <canvas
                    ref={(ref) => (canvasRefs.current[index] = ref)}
                    className={styles.scratchCanvas}
                    onMouseDown={() => handleMouseDown(index)}
                    onMouseUp={() => handleMouseUp(index)}
                    onMouseLeave={() => handleMouseUp(index)}
                    onTouchStart={() => handleMouseDown(index)}
                    onTouchEnd={() => handleMouseUp(index)}
                    onMouseMove={(e) => handleMouseMove(e, index)}
                    onTouchMove={(e) => handleTouchMove(e, index)}
                  />

                  {/* Compact progress indicator */}
                  {progress > 0 && (
                    <div className={styles.scratchProgress}>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressFill}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {isGameComplete && (
        <div className={styles.completeSection}>
          <Typography variant="h5" color="success.main" gutterBottom>
            🎉 Bạn đã cào hết số thẻ cho phép!
          </Typography>
          <button className={styles.completeButton} onClick={handleComplete}>
            Hoàn thành - Nhận {totalPoints} điểm
          </button>
        </div>
      )}

      {scratchCount < maxScratch && (
        <div className={styles.infoSection}>
          <Typography color="primary">
            💡 Bạn còn {maxScratch - scratchCount} lượt cào. Kéo chuột hoặc ngón
            tay để cào thẻ!
          </Typography>
        </div>
      )}
    </div>
  );
};

export default ScratchCardUI;

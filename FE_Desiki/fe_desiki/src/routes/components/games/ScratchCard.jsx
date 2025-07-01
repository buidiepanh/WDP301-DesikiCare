"use client"

import { useState } from "react"
import { Box, Button, Typography, Paper } from "@mui/material"
import { ArrowBack } from "@mui/icons-material"

const ScratchCard = ({ gameData, onComplete, onBack }) => {
  const { gameEvent, gameTypeImageUrls } = gameData
  const config = gameEvent.configJson
  const { cards, maxScratch, numOfScratchs } = config

  const [scratchedCards, setScratchedCards] = useState([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [scratchCount, setScratchCount] = useState(0)

  const handleCardScratch = (cardIndex) => {
    if (scratchedCards.includes(cardIndex) || scratchCount >= maxScratch) return

    const card = cards[cardIndex]
    setScratchedCards((prev) => [...prev, cardIndex])
    setTotalPoints((prev) => prev + card.point)
    setScratchCount((prev) => prev + 1)
  }

  const handleComplete = () => {
    onComplete(gameEvent._id, totalPoints)
  }

  const isGameComplete = scratchCount >= maxScratch

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Button startIcon={<ArrowBack />} onClick={onBack} className="back-button" variant="outlined">
          Quay lại
        </Button>
      </Box>

      <Box className="game-header">
        <Typography variant="h4" gutterBottom>
          {gameEvent.gameName}
        </Typography>
        <Typography variant="subtitle1">{gameEvent.eventName}</Typography>
      </Box>

      <Box className="game-stats">
        <Box className="stat-item">
          <Box className="stat-value">
            {scratchCount}/{maxScratch}
          </Box>
          <Box className="stat-label">Thẻ đã cào</Box>
        </Box>
        <Box className="stat-item">
          <Box className="stat-value">{totalPoints}</Box>
          <Box className="stat-label">Tổng điểm</Box>
        </Box>
        <Box className="stat-item">
          <Box className="stat-value">{numOfScratchs}</Box>
          <Box className="stat-label">Tổng số thẻ</Box>
        </Box>
      </Box>

      <Box className="scratch-cards-container">
        {cards.map((card, index) => {
          const isScratched = scratchedCards.includes(index)
          const cardImage = gameTypeImageUrls.find((img) => img.id === index)?.imageUrl || card.img

          return (
            <Box
              key={index}
              className={`scratch-card ${isScratched ? "scratched" : ""}`}
              onClick={() => handleCardScratch(index)}
              sx={{
                backgroundImage: isScratched
                  ? `url(${cardImage})`
                  : `url(${config.backCoverImg || gameEvent.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!isScratched ? (
                <Box
                  className="scratch-overlay"
                  sx={{
                    backgroundImage: `url(${config.backCoverImg || gameEvent.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      backgroundColor: "rgba(0,0,0,0.7)",
                      padding: "4px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    Cào để mở
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "rgba(236, 64, 122, 0.9)",
                    color: "white",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h6" sx={{ color: card.text || "white" }}>
                    {card.label}
                  </Typography>
                  <Typography variant="body2">+{card.point} điểm</Typography>
                </Box>
              )}
            </Box>
          )
        })}
      </Box>

      {isGameComplete && (
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Typography variant="h5" color="success.main" gutterBottom>
            🎉 Bạn đã cào hết số thẻ cho phép!
          </Typography>
          <Button variant="contained" color="success" onClick={handleComplete} size="large">
            Hoàn thành - Nhận {totalPoints} điểm
          </Button>
        </Box>
      )}

      {scratchCount < maxScratch && (
        <Paper sx={{ p: 2, mt: 2, textAlign: "center", backgroundColor: "#e3f2fd" }}>
          <Typography color="primary">💡 Bạn còn {maxScratch - scratchCount} lượt cào. Chọn thẻ để cào!</Typography>
        </Paper>
      )}
    </Box>
  )
}

export default ScratchCard

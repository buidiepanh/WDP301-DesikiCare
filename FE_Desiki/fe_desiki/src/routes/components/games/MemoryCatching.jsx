"use client"

import { useState, useEffect } from "react"
import { Box, Button, Typography, Paper } from "@mui/material"
import { ArrowBack } from "@mui/icons-material"

const MemoryCatching = ({ gameData, onComplete, onBack }) => {
  const { gameEvent, gameTypeImageUrls } = gameData
  const config = gameEvent.configJson
  const { numOfPairs, originalPoint, minusPoint } = config

  const [cards, setCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [matchedCards, setMatchedCards] = useState([])
  const [flips, setFlips] = useState(0)
  const [currentPoints, setCurrentPoints] = useState(originalPoint)
  const [isGameComplete, setIsGameComplete] = useState(false)

  const safeFlips = numOfPairs

  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = () => {
    // Create pairs of cards
    const gameCards = []
    const availableImages = gameTypeImageUrls.slice(0, numOfPairs)

    for (let i = 0; i < numOfPairs; i++) {
      const imageUrl = availableImages[i]?.imageUrl || gameEvent.imageUrl
      gameCards.push(
        { id: i * 2, pairId: i, imageUrl, isFlipped: false, isMatched: false },
        { id: i * 2 + 1, pairId: i, imageUrl, isFlipped: false, isMatched: false },
      )
    }

    // Shuffle cards
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5)
    setCards(shuffledCards)
  }

  const handleCardClick = (cardId) => {
    if (flippedCards.length >= 2 || isGameComplete) return

    const card = cards.find((c) => c.id === cardId)
    if (card.isFlipped || card.isMatched) return

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    // Update card state
    setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c)))

    if (newFlippedCards.length === 2) {
      const [firstId, secondId] = newFlippedCards
      const firstCard = cards.find((c) => c.id === firstId)
      const secondCard = cards.find((c) => c.id === secondId)

      setFlips((prev) => prev + 1)

      setTimeout(() => {
        if (firstCard.pairId === secondCard.pairId) {
          // Match found
          setMatchedCards((prev) => [...prev, firstId, secondId])
          setCards((prev) => prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c)))

          // Check if game is complete
          if (matchedCards.length + 2 === cards.length) {
            setIsGameComplete(true)
          }
        } else {
          // No match - flip back
          setCards((prev) => prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c)))

          // Deduct points if over safe flips
          if (flips >= safeFlips) {
            setCurrentPoints((prev) => Math.max(0, prev - minusPoint))
          }
        }

        setFlippedCards([])
      }, 1000)
    }
  }

  const handleComplete = () => {
    onComplete(gameEvent._id, currentPoints)
  }

  const gridCols = Math.ceil(Math.sqrt(numOfPairs * 2))

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
          <Box className="stat-value">{flips}</Box>
          <Box className="stat-label">Lượt lật</Box>
        </Box>
        <Box className="stat-item">
          <Box className="stat-value">
            {matchedCards.length / 2}/{numOfPairs}
          </Box>
          <Box className="stat-label">Cặp đã ghép</Box>
        </Box>
        <Box className="stat-item">
          <Box className="stat-value">{currentPoints}</Box>
          <Box className="stat-label">Điểm hiện tại</Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
        <Box
          className="memory-grid"
          sx={{
            gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
            maxWidth: "600px",
          }}
        >
          {cards.map((card) => (
            <Box
              key={card.id}
              className={`memory-card ${card.isFlipped ? "flipped" : ""} ${card.isMatched ? "matched" : ""}`}
              onClick={() => handleCardClick(card.id)}
              sx={{
                backgroundImage:
                  card.isFlipped || card.isMatched
                    ? `url(${card.imageUrl})`
                    : `url(${config.backCoverImg || gameEvent.imageUrl})`,
                opacity: card.isMatched ? 0.6 : 1,
              }}
            />
          ))}
        </Box>
      </Box>

      {flips > safeFlips && (
        <Paper sx={{ p: 2, mb: 2, backgroundColor: "#fff3e0", textAlign: "center" }}>
          <Typography color="warning.main">
            ⚠️ Bạn đã vượt quá {safeFlips} lượt an toàn! Mỗi lượt sai sẽ bị trừ {minusPoint} điểm.
          </Typography>
        </Paper>
      )}

      {isGameComplete && (
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Typography variant="h5" color="success.main" gutterBottom>
            🎉 Chúc mừng! Bạn đã hoàn thành!
          </Typography>
          <Button variant="contained" color="success" onClick={handleComplete} size="large">
            Nhận {currentPoints} điểm
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default MemoryCatching

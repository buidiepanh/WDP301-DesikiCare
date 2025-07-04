"use client";

import { useState, useRef } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import "./spinStyles.css";

const SpinningWheel = ({ gameData, onComplete, onBack }) => {
  const wheelRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentSpin, setCurrentSpin] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [lastResult, setLastResult] = useState(null);
  const [rotation, setRotation] = useState(0);

  const { gameEvent } = gameData;
  const config = gameEvent.configJson;
  const { sectors, maxSpin, numOfSectors, isDuplicate } = config;
  const [availableSectors, setAvailableSectors] = useState([...sectors]);

  const canSpin = currentSpin < maxSpin && !isSpinning;
  const isGameComplete =
    currentSpin >= maxSpin || (!isDuplicate && availableSectors.length === 0);

  const spinWheel = () => {
    if (!canSpin) return;

    setIsSpinning(true);

    // Generate random spin (3-6 full rotations + random angle)
    const minSpins = 3;
    const maxSpins = 6;
    const randomSpins = Math.random() * (maxSpins - minSpins) + minSpins;
    const randomAngle = Math.random() * 360;
    const totalRotation = randomSpins * 360 + randomAngle;

    const newRotation = rotation + totalRotation;
    setRotation(newRotation);

    // Apply CSS animation
    if (wheelRef.current) {
      wheelRef.current.style.transform = `rotate(${newRotation}deg)`;
      wheelRef.current.classList.add("spinning");
    }

    // Calculate result after animation completes
    setTimeout(() => {
      // Determine which sector was hit
      const normalizedRotation = (360 - (newRotation % 360)) % 360;
      const sectorAngle = 360 / availableSectors.length;
      const sectorIndex = Math.floor(normalizedRotation / sectorAngle);
      const selectedSector =
        availableSectors[sectorIndex] || availableSectors[0];

      setLastResult(selectedSector);
      setTotalPoints((prev) => prev + selectedSector.value);
      setCurrentSpin((prev) => prev + 1);

      // Remove sector if isDuplicate is false
      if (!isDuplicate) {
        setAvailableSectors((prev) =>
          prev.filter((_, index) => index !== sectorIndex)
        );
      }

      setIsSpinning(false);
      if (wheelRef.current) {
        wheelRef.current.classList.remove("spinning");
      }
    }, 4000); // Match CSS animation duration
  };

  const handleComplete = () => {
    onComplete(gameEvent._id, totalPoints);
  };

  // Create SVG path for each sector
  const createSectorPath = (index, total, radius = 140) => {
    const angle = (360 / total) * (Math.PI / 180);
    const startAngle = index * angle - Math.PI / 2; // Start from top
    const endAngle = (index + 1) * angle - Math.PI / 2;

    const x1 = Math.cos(startAngle) * radius;
    const y1 = Math.sin(startAngle) * radius;
    const x2 = Math.cos(endAngle) * radius;
    const y2 = Math.sin(endAngle) * radius;

    const largeArcFlag = angle > Math.PI ? 1 : 0;

    return `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  // Calculate text position for each sector
  const getTextPosition = (index, total, radius = 100) => {
    const angle = (360 / total) * (Math.PI / 180);
    const textAngle = index * angle + angle / 2 - Math.PI / 2;
    const x = Math.cos(textAngle) * radius;
    const y = Math.sin(textAngle) * radius;
    return { x, y, angle: (textAngle * 180) / Math.PI + 90 };
  };

  const renderWheel = () => {
    const wheelSize = 300;
    const centerX = wheelSize / 2;
    const centerY = wheelSize / 2;

    return (
      <div className="wheel-container" style={{ minHeight: "0px" }}>
        {/* Pointer */}
        <div className="wheel-pointer"></div>

        {/* SVG Wheel */}
        <div
          ref={wheelRef}
          className="spinning-wheel-svg"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <svg width={wheelSize} height={wheelSize} className="wheel-svg">
            {/* Sectors */}
            {availableSectors.map((sector, index) => {
              const path = createSectorPath(index, availableSectors.length);
              const textPos = getTextPosition(index, availableSectors.length);

              return (
                <g key={index}>
                  {/* Sector Path */}
                  <path
                    d={path}
                    fill={sector.color || "#ec407a"}
                    stroke="#fff"
                    strokeWidth="2"
                    transform={`translate(${centerX}, ${centerY})`}
                    className="wheel-sector-svg"
                  />

                  {/* Sector Text */}
                  <g
                    transform={`translate(${centerX + textPos.x}, ${
                      centerY + textPos.y
                    })`}
                  >
                    <text
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={sector.text || "#fff"}
                      fontSize="12"
                      fontWeight="bold"
                      textShadow="1px 1px 2px rgba(0,0,0,0.5)"
                      transform={`rotate(${textPos.angle})`}
                    >
                      <tspan x="0" dy="-8">
                        {sector.label}
                      </tspan>
                      <tspan x="0" dy="16" fontSize="10" opacity="0.9">
                        +{sector.value}
                      </tspan>
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Center Circle */}
            <circle
              cx={centerX}
              cy={centerY}
              r="30"
              fill="url(#centerGradient)"
              stroke="#fff"
              strokeWidth="4"
              className="wheel-center-svg"
            />

            {/* Gradient Definition */}
            <defs>
              <linearGradient
                id="centerGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#ec407a" />
                <stop offset="100%" stopColor="#f06292" />
              </linearGradient>
            </defs>

            {/* Center Icon */}
            <text
              x={centerX}
              y={centerY}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="20"
              className="center-icon-svg"
            >
              🎯
            </text>
          </svg>
        </div>
      </div>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={onBack}
          className="back-button"
          variant="outlined"
        >
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
            {currentSpin}/{maxSpin}
          </Box>
          <Box className="stat-label">Lượt quay</Box>
        </Box>
        <Box className="stat-item">
          <Box className="stat-value">{totalPoints}</Box>
          <Box className="stat-label">Tổng điểm</Box>
        </Box>
        <Box className="stat-item">
          <Box className="stat-value">{availableSectors.length}</Box>
          <Box className="stat-label">Ô còn lại</Box>
        </Box>
      </Box>

      {/* Compact wheel container */}
      <div className="spinning-wheel-container">
        {renderWheel()}

        {lastResult && (
          <Paper
            sx={{ p: 2, textAlign: "center", backgroundColor: "#f8f9fa" }}
            className="result-animation"
          >
            <Typography
              variant="h6"
              sx={{ color: "#ec407a", fontWeight: "bold" }}
            >
              🎉 Kết quả: {lastResult.label}
            </Typography>
            <Typography
              variant="h5"
              sx={{ color: "#4caf50", fontWeight: "bold", mt: 1 }}
            >
              +{lastResult.value} điểm
            </Typography>
          </Paper>
        )}

        <Box sx={{ textAlign: "center" }}>
          {!isGameComplete ? (
            <Button
              variant="contained"
              onClick={spinWheel}
              disabled={!canSpin}
              className={`spin-button ${isSpinning ? "spinning-button" : ""}`}
              size="large"
            >
              {isSpinning ? (
                <>
                  <span className="spinner-icon">⚡</span>
                  Đang quay...
                </>
              ) : (
                <>
                  <span className="play-icon">🎲</span>
                  QUAY NGAY!
                </>
              )}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              onClick={handleComplete}
              size="large"
              className="complete-button"
            >
              <span className="trophy-icon">🏆</span>
              Hoàn thành - Nhận {totalPoints} điểm
            </Button>
          )}
        </Box>
      </div>
    </Box>
  );
};

export default SpinningWheel;

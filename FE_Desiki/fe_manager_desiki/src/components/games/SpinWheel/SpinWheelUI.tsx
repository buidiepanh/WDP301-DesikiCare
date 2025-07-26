// import { Button } from "@mui/material";
// import React, { useEffect, useRef, useState } from "react";
// import SpinWheel, { type Sector, type SpinWheelHandle } from "ts-spin-wheel";

// // export type Sector = {
// //   color: string;
// //   text: string;
// //   label: string;
// // };

// type Props = {
//   sectors: {
//     color: string;
//     text: string;
//     label: string;
//   }[];
//   isDuplicate: boolean;
//   maxSpin: number;
// };

// export const SpinWheelUI: React.FC<Props> = ({
//   sectors,
//   isDuplicate,
//   maxSpin,
// }) => {
//   // STATES
//   const [spinCount, setSpinCount] = useState(0);
//   const [wheelData, setWheelData] = useState<Sector[]>([]);

//   // HOOKS
//   const wheelRef = useRef<SpinWheelHandle>(null);

//   useEffect(() => {
//     if (sectors && sectors.length > 0) {
//       setWheelData(sectors);
//       setSpinCount(0);
//     }
//   }, [sectors]);

//   const triggerSpin = () => {
//     if (!wheelRef.current) return;
//     if (spinCount >= maxSpin) return alert("Bạn đã dùng hết lượt quay!");

//     wheelRef.current.spin();
//     setSpinCount(spinCount + 1);
//   };

//   const handleSpinEnd = (winner?: Sector) => {
//     if (!winner) {
//       console.warn("Spin ended but no winner found.");
//       return;
//     }

//     if (!isDuplicate) {
//       setWheelData((prev) =>
//         prev.filter((item) => item.label !== winner.label)
//       );
//     }
//   };

//   const resetGame = () => {
//     setWheelData(sectors);
//     setSpinCount(0);
//   };

//   return (
//     <div className="w-full p-5 flex flex-col items-center">
//       <p className="mb-20 text-yellow-400 text-2xl font-bold">
//         Chào mừng đến với vòng quay!
//       </p>

//       {wheelData.length > 0 && (
//         <SpinWheel
//           ref={wheelRef}
//           sectors={wheelData}
//           size={350}
//           onSpinEnd={handleSpinEnd}
//           labelFontSize={12}
//           spinButtonStyles={{
//             display: "none",
//           }}
//           spinButtonArrowStyle={{
//             top: "-9px",
//             border: "8px solid transparent",
//             borderBottomColor: "red",
//           }}
//           wheelBaseWidth="100%"
//           wheelBaseBottom="4px"
//           // customModalContent={(winner, onClose) => (
//           //   <div className="fixed inset-0 bg-cyan-200 bg-opacity-60 flex items-center justify-center z-50">
//           //     <div className="bg-yellow-100 p-8 rounded-xl shadow-xl text-center">
//           //       <h1 className="text-2xl font-bold text-green-700">
//           //         🌟 You got: {winner.label}
//           //       </h1>
//           //       <p className="mt-2">Enjoy your reward!</p>
//           //       <button
//           //         className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
//           //         onClick={onClose}
//           //       >
//           //         Close
//           //       </button>
//           //     </div>
//           //   </div>
//           // )}
//         />
//       )}

//       <p className="mt-20">Số lượt quay còn lại: {maxSpin - spinCount}</p>

//       <div className="flex gap-4 mt-2">
//         <Button
//           disabled={spinCount >= maxSpin}
//           variant="contained"
//           color="success"
//           onClick={triggerSpin}
//         >
//           Quay vòng quay
//         </Button>
//         <Button variant="outlined" color="error" onClick={resetGame}>
//           Reset
//         </Button>
//       </div>
//     </div>
//   );
// };

import type React from "react";
import { useState, useEffect } from "react";
import styles from "./SpinWheelUI.module.css";

type Sector = {
  value: number;
  label: string;
  color: string;
  text: string;
};

type Props = {
  sectors: Sector[];
  isDuplicate: boolean;
  maxSpin: number;
};

const SpinWheelUI: React.FC<Props> = ({
  sectors: initialSectors,
  isDuplicate,
  maxSpin,
}) => {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [spinsLeft, setSpinsLeft] = useState(maxSpin);
  const [totalScore, setTotalScore] = useState(0);
  const [availableSectors, setAvailableSectors] =
    useState<Sector[]>(initialSectors);
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [gameEnded, setGameEnded] = useState(false);

  useEffect(() => {
    if (spinsLeft === 0 && maxSpin > 0) {
      setGameEnded(true);
    }
    console.log("sector: ", initialSectors);
  }, [spinsLeft, maxSpin]);

  const resetGame = () => {
    setAvailableSectors(initialSectors);
    setSpinsLeft(maxSpin);
    setTotalScore(0);
    setGameEnded(false);
    setSelectedSector(null);
    setRotation(0);
    setSpinning(false);
  };

  const handleSpin = () => {
    if (spinning || spinsLeft === 0 || availableSectors.length === 0) {
      if (availableSectors.length === 0) setGameEnded(true);
      return;
    }

    setSpinning(true);
    setSelectedSector(null);

    const numAvailableSectors = availableSectors.length;
    const originalSectorAngle = 360 / numAvailableSectors;

    // Determine the target sector for this spin from available sectors
    const targetSectorIndexInAvailable = Math.floor(
      Math.random() * numAvailableSectors
    );
    const targetSector = availableSectors[targetSectorIndexInAvailable];

    const targetAngleOffset =
      targetSectorIndexInAvailable * originalSectorAngle;

    // Calculate the final rotation:
    // We want the middle of the target sector to align with the pointer (at top, 0 degrees/12h).
    // The wheel rotates clockwise.
    // Add multiple full rotations for visual effect.
    const minRotations = 5;
    const randomExtraRotationWithinSector =
      Math.random() * (originalSectorAngle - 10) + 5; // Small random offset within the sector
    const newRotation =
      rotation +
      minRotations * 360 +
      -(targetAngleOffset + originalSectorAngle / 2) +
      randomExtraRotationWithinSector;

    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      setSelectedSector(targetSector);
      setTotalScore((prevScore) => prevScore + (targetSector.value || 0));
      setSpinsLeft((prev) => prev - 1);

      if (!isDuplicate) {
        console.log(
          "Before filter - Available sectors:",
          availableSectors.length
        );
        console.log("Target sector to remove:", targetSector);
        setAvailableSectors((prevSectors) => {
          const filtered = prevSectors.filter(
            (s) =>
              !(
                s.label === targetSector.label && s.value === targetSector.value
              )
          );
          console.log("After filter - Remaining sectors:", filtered.length);
          return filtered;
        });
      }
    }, 5000); // 5 seconds animation duration
  };

  // Generate conic-gradient string for the wheel background
  const getConicGradient = () => {
    if (availableSectors.length === 0)
      return "conic-gradient(#ccc 0deg 360deg)";

    let gradientString = "conic-gradient(";
    let currentAngle = 0;
    const baseSectorAngle = 360 / availableSectors.length;

    availableSectors.forEach((sector, index) => {
      const startAngle = currentAngle;
      const endAngle = currentAngle + baseSectorAngle;
      gradientString += `${sector.color} ${startAngle}deg ${endAngle}deg`;
      if (index < availableSectors.length - 1) {
        gradientString += ", ";
      }
      currentAngle = endAngle;
    });
    gradientString += ")";
    return gradientString;
  };

  return (
    <div className={styles.spinWheelContainer}>
      <h2 className="mb-20">Spin Wheel Game</h2>
      <div className={styles.pointerContainer}>
        <div className={styles.pointerShape}></div>
      </div>
      <div className={styles.wheelWrapper}>
        <div
          className={`${styles.wheel} ${spinning ? styles.spinning : ""}`}
          style={{
            transform: `rotate(${rotation}deg)`,
            backgroundImage: getConicGradient(),
          }}
        >
          {/* Render labels for each sector */}
          {availableSectors.map((sector, index) => {
            const baseSectorAngle = 360 / availableSectors.length;
            const sectorMidAngle =
              index * baseSectorAngle + baseSectorAngle / 2;
            const radius = 120; // Distance from center to place the text
            const x = Math.sin((sectorMidAngle * Math.PI) / 180) * radius;
            const y = -Math.cos((sectorMidAngle * Math.PI) / 180) * radius;

            return (
              <div
                key={`${sector.label}-${index}`}
                className={styles.sectorLabel}
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                  color: sector.text || "white",
                }}
              >
                {/* {sector.label} */}
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.gameControls}>
        <button
          className={styles.spinButton}
          onClick={handleSpin}
          disabled={spinning || gameEnded}
        >
          {spinning ? "Spinning..." : "Spin"}
        </button>
        <button className={styles.resetButton} onClick={resetGame}>
          Reset Game
        </button>
      </div>

      <div className={styles.gameInfo}>
        <p>Spins Left: {spinsLeft}</p>
        <p>Total Score: {totalScore}</p>
        {selectedSector && (
          <p>
            Last Win: {selectedSector.label} ({selectedSector.value || 0}{" "}
            points)
          </p>
        )}
        {gameEnded && (
          <p className={styles.gameOver}>
            Game Over! Final Score: {totalScore}
          </p>
        )}
      </div>
    </div>
  );
};

export default SpinWheelUI;

"use client";
import { useState, useEffect, useCallback } from "react";
import "./styles.css";

type GameConfigJson = {
  isDuplicate: boolean;
  maxSpin: number;
  numOfSectors: number;
  sectors: {
    color: string; //Sector Background Color
    label: string; //Label Text
    value: number; //Points Value
    text: string; //Sector Label Color
  }[];
};

type GameEvent = {
  gameEvent: {
    _id: string;
    balancePoints: number;
    configJson: GameConfigJson;
    eventName: string;
    gameName: string;
    gameTypeId: number;
    imageUrl: string;
    description: string;
    isDeactivated: boolean;
    endDate: string; //Format: "2023-10-31T23:59:59.999Z"
    startDate: string; //Format: "2023-10-01T00:00:00.000Z"
    createdAt: string; //Format: "2023-10-01T00:00:00.000Z"
    updatedAt: string; //Format: "2023-10-01T00:00:00.000Z"
  };
  gameEventRewardResults: any;
  gameTypeImageUrls: {
    id: string; //index 1-2-3-4-...
    imageUrl: string;
  }[];
};

interface Props {
  gameEvent: GameEvent;
  onFinish: (finalPoints: number) => void;
}

interface SpinResult {
  spin: number;
  label: string;
  points: number;
}

export const SpinWheelGame = ({ gameEvent, onFinish }: Props) => {
  // STATES
  const [availableSectors, setAvailableSectors] = useState(
    gameEvent.gameEvent.configJson.sectors
  );
  const [currentRotation, setCurrentRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinsLeft, setSpinsLeft] = useState(
    gameEvent.gameEvent.configJson.maxSpin
  );
  const [spinResults, setSpinResults] = useState<SpinResult[]>([]);
  const [finalPoints, setFinalPoints] = useState(0);
  const [selectedSector, setSelectedSector] = useState<any>(null);

  // Snapshot states - critical for accurate calculation
  const [sectorsAtSpinTime, setSectorsAtSpinTime] = useState<any[]>([]);
  const [rotationAtSpinTime, setRotationAtSpinTime] = useState(0);

  const config = gameEvent.gameEvent.configJson;

  // Calculate angle for each sector
  const sectorAngle = 360 / availableSectors.length;

  // Handle spin wheel
  const handleSpin = useCallback(() => {
    if (isSpinning || spinsLeft <= 0 || availableSectors.length === 0) return;

    setIsSpinning(true);
    setSelectedSector(null);

    // Lưu snapshot NGAY ĐẦU và sử dụng snapshot cho tất cả tính toán
    const sectorsSnapshot = [...availableSectors];
    setSectorsAtSpinTime(sectorsSnapshot);

    const numAvailableSectors = sectorsSnapshot.length;
    const originalSectorAngle = 360 / numAvailableSectors;

    // Determine the target sector for this spin from SNAPSHOT
    const targetSectorIndexInAvailable = Math.floor(
      Math.random() * numAvailableSectors
    );
    const targetSector = sectorsSnapshot[targetSectorIndexInAvailable];

    const targetAngleOffset =
      targetSectorIndexInAvailable * originalSectorAngle;

    // Calculate the final rotation:
    // We want the middle of the target sector to align with the pointer (at top, 0 degrees/12h).
    const minRotations = 5;

    console.log("=== ROTATION CALCULATION ===");
    console.log("Target sector index:", targetSectorIndexInAvailable);
    console.log("Target sector:", targetSector);
    console.log("Target angle offset:", targetAngleOffset);
    console.log("Sector angle:", originalSectorAngle);

    // Calculate rotation to align target sector center with top (12h)
    const currentWheelPosition = currentRotation % 360;
    const currentWheelPositionNormalized =
      ((currentWheelPosition % 360) + 360) % 360;

    // Calculate where the target sector currently is relative to 12h
    const targetSectorCenter = targetAngleOffset + originalSectorAngle / 2;

    // In SVG coordinate system, 0° is at 3h position
    // But our pointer is at 12h position, which is -90° in SVG
    // So we need to align target sector center with -90° (or 270°)
    const pointerAngleInSVG = 270; // 12h position in SVG coordinate system

    // Calculate rotation needed to align target sector center with pointer at 12h
    let rotationNeeded = pointerAngleInSVG - targetSectorCenter;

    // Normalize to make it a reasonable rotation (prefer negative for clockwise)
    while (rotationNeeded > 180) {
      rotationNeeded -= 360;
    }
    while (rotationNeeded <= -180) {
      rotationNeeded += 360;
    }

    const newRotation = currentRotation + minRotations * 360 + rotationNeeded;

    console.log("Current wheel position:", currentWheelPositionNormalized);
    console.log("Target sector center (original):", targetSectorCenter);
    console.log("Pointer angle in SVG (12h):", pointerAngleInSVG);
    console.log("Rotation needed to align:", rotationNeeded);
    console.log("New total rotation:", newRotation);
    console.log(
      "Expected wheel final position:",
      ((newRotation % 360) + 360) % 360
    );
    console.log(
      "Final target position at pointer (should be 270°):",
      (((targetSectorCenter + newRotation) % 360) + 360) % 360
    );
    console.log("============================");

    setCurrentRotation(newRotation);
    setRotationAtSpinTime(newRotation);

    // Đợi animation hoàn thành
    setTimeout(() => {
      setIsSpinning(false);
      setSelectedSector(targetSector);

      // Debug: Calculate which sector is actually at 12h position after rotation
      const finalRotation = newRotation % 360;
      const normalizedRotation = ((finalRotation % 360) + 360) % 360;

      // Use sectorsSnapshot (same data used for rotation calculation)
      const numSectors = sectorsSnapshot.length;
      const baseSectorAngle = 360 / numSectors;

      // Find which sector contains the 270° position (12h pointer in SVG)
      // When wheel rotates, sectors move in opposite direction
      const pointerPositionInWheel = (270 - normalizedRotation + 360) % 360;
      const sectorAtPointerIndex =
        Math.floor(pointerPositionInWheel / baseSectorAngle) % numSectors;
      const actualSectorAtPointer = sectorsSnapshot[sectorAtPointerIndex];

      console.log("=== DEBUG SPIN RESULT (with snapshots) ===");
      console.log("Final rotation (local variable mod 360):", finalRotation);
      console.log("Normalized rotation:", normalizedRotation);
      console.log(
        "Pointer position in wheel (270° adjusted):",
        pointerPositionInWheel
      );
      console.log("Sectors count (snapshot):", numSectors);
      console.log("Sector angle (snapshot):", baseSectorAngle);
      console.log("Calculated sector index at pointer:", sectorAtPointerIndex);
      console.log("Actual sector at pointer:", actualSectorAtPointer);
      console.log("Target sector (should win):", targetSector);
      console.log(
        "Match?",
        actualSectorAtPointer?.label === targetSector.label
      );
      console.log("==========================================");

      // Add to results
      const newResult: SpinResult = {
        spin: config.maxSpin - spinsLeft + 1,
        label: targetSector.label,
        points: targetSector.value,
      };

      setSpinResults((prev) => [...prev, newResult]);
      setFinalPoints((prev) => prev + targetSector.value);
      setSpinsLeft((prev) => prev - 1);

      // Remove sector if not duplicate allowed
      if (!config.isDuplicate) {
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
    }, 3000); // Match CSS transition duration
  }, [isSpinning, spinsLeft, availableSectors, currentRotation, config]);

  // Auto finish when no spins left
  useEffect(() => {
    if (spinsLeft === 0 && spinResults.length > 0) {
      setTimeout(() => {
        onFinish(finalPoints);
      }, 1000); // Small delay to show final result
    }
  }, [spinsLeft, spinResults.length, finalPoints, onFinish]);

  // Render sectors
  const renderSectors = () => {
    // Use current available sectors (not snapshot) for rendering
    const sectorAngle = 360 / availableSectors.length;

    return availableSectors.map((sector, index) => {
      const startAngle = index * sectorAngle;
      const endAngle = (index + 1) * sectorAngle;
      const isEven = index % 2 === 0;

      // Calculate path for sector using SVG arc
      const radius = 140; // Half of wheel width minus border
      const centerX = 150;
      const centerY = 150;

      const startAngleRad = (startAngle * Math.PI) / 180;
      const endAngleRad = (endAngle * Math.PI) / 180;

      const x1 = centerX + radius * Math.cos(startAngleRad);
      const y1 = centerY + radius * Math.sin(startAngleRad);
      const x2 = centerX + radius * Math.cos(endAngleRad);
      const y2 = centerY + radius * Math.sin(endAngleRad);

      const largeArcFlag = sectorAngle > 180 ? 1 : 0;

      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        "Z",
      ].join(" ");

      // Calculate label position (on the bisector of the sector)
      const labelAngle = startAngle + sectorAngle / 2;
      const labelDistance = 70; // Distance from center
      const labelX =
        centerX + labelDistance * Math.cos((labelAngle * Math.PI) / 180);
      const labelY =
        centerY + labelDistance * Math.sin((labelAngle * Math.PI) / 180);

      return (
        <g key={`${sector.label}-${index}`}>
          <path
            d={pathData}
            fill={isEven ? "#000" : "#fff"}
            stroke="#ccc"
            strokeWidth="1"
          />
          <text
            x={labelX}
            y={labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={isEven ? "#fff" : "#000"}
            fontSize="11"
            fontWeight="bold"
            transform={`rotate(${labelAngle}, ${labelX}, ${labelY})`}
          >
            {sector.label}
          </text>
        </g>
      );
    });
  };

  return (
    <div className="spin-wheel-container">
      <div className="game-info">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          {gameEvent.gameEvent.eventName}
        </h2>
        <p className="text-gray-500 text-sm">Spin Wheel Game</p>
      </div>

      <div className="game-content">
        <div className="wheel-section">
          {/* Pointer */}
          <div className="wheel-pointer"></div>

          {/* Spin Wheel */}
          <div className="spin-wheel">
            <svg
              width="294"
              height="294"
              viewBox="0 0 300 300"
              style={{
                transform: `rotate(${currentRotation}deg)`,
                transition: "transform 3s cubic-bezier(0.23, 1, 0.32, 1)",
              }}
            >
              {renderSectors()}
            </svg>
          </div>

          {/* Spin Info */}
          <div className="spins-info">
            <p className="font-medium">
              Spins Left: {spinsLeft} / {config.maxSpin}
            </p>
            <p className="text-xs text-gray-500">
              Sectors Available: {availableSectors.length}
            </p>
          </div>

          {/* Spinning Indicator */}
          {isSpinning && (
            <div className="spinning-indicator">
              <p className="font-medium">🎰 Spinning...</p>
            </div>
          )}

          {/* Spin Button */}
          <button
            className="spin-button"
            onClick={handleSpin}
            disabled={
              isSpinning || spinsLeft <= 0 || availableSectors.length === 0
            }
          >
            {isSpinning
              ? "Spinning..."
              : spinsLeft <= 0
              ? "Game Complete"
              : availableSectors.length === 0
              ? "No Sectors Left"
              : `Spin (${spinsLeft} left)`}
          </button>
        </div>

        {/* Results Panel */}
        <div className="results-panel">
          <h3 className="text-lg font-semibold mb-3 text-center">
            🏆 Spin Results
          </h3>

          {selectedSector && (
            <div className="mb-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-700 font-medium text-sm text-center">
                🎉 Last Result: {selectedSector.label} (+{selectedSector.value}{" "}
                pts)
              </p>
            </div>
          )}

          {spinResults.length === 0 ? (
            <p className="text-gray-400 text-center text-sm">No spins yet</p>
          ) : (
            <div>
              {spinResults.map((result, index) => (
                <div key={index} className="result-item">
                  <span className="font-medium">
                    Spin {result.spin}: {result.label}
                  </span>
                  <span className="font-semibold text-green-600">
                    +{result.points}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="total-points">🎯 Total: {finalPoints} pts</div>

          {spinsLeft === 0 && (
            <div className="text-center mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-700 font-medium text-sm">
                🎊 Game completed! Finalizing...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

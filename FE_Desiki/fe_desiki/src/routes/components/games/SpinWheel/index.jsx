import { useState, useEffect } from "react";
import styles from "./SpinWheel.module.css";

const SpinWheelUI = ({
  gameName,
  sectors: initialSectors,
  isDuplicate,
  maxSpin,
  gameEventId,
  onComplete,
  onBack,
}) => {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [spinsLeft, setSpinsLeft] = useState(maxSpin);
  const [totalScore, setTotalScore] = useState(0);
  const [availableSectors, setAvailableSectors] = useState(initialSectors);
  const [selectedSector, setSelectedSector] = useState(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [sectorsAtSpinTime, setSectorsAtSpinTime] = useState([]); // ← Snapshot của sectors tại thời điểm quay
  const [rotationAtSpinTime, setRotationAtSpinTime] = useState(0); // ← Snapshot của rotation tại thời điểm quay

  useEffect(() => {
    if (spinsLeft === 0 && maxSpin > 0) {
      setGameEnded(true);
    }
    console.log("sector: ", initialSectors);
  }, [spinsLeft, maxSpin]);

  // const resetGame = () => {
  //   setAvailableSectors(initialSectors);
  //   setSpinsLeft(maxSpin);
  //   setTotalScore(0);
  //   setGameEnded(false);
  //   setSelectedSector(null);
  //   setRotation(0);
  //   setSpinning(false);
  //   setSectorsAtSpinTime([]); // ← Reset snapshot
  //   setRotationAtSpinTime(0); // ← Reset rotation snapshot
  // };

  const handleSpin = () => {
    if (spinning || spinsLeft === 0 || availableSectors.length === 0) {
      if (availableSectors.length === 0) setGameEnded(true);
      return;
    }

    setSpinning(true);
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
    // The wheel rotates clockwise.
    // Add multiple full rotations for visual effect.
    const minRotations = 5;
    const randomExtraRotationWithinSector =
      Math.random() * (originalSectorAngle - 10) + 5; // Small random offset within the sector

    // Debug the calculation
    console.log("=== ROTATION CALCULATION ===");
    console.log("Target sector index:", targetSectorIndexInAvailable);
    console.log("Target sector:", targetSector);
    console.log("Target angle offset:", targetAngleOffset);
    console.log("Sector angle:", originalSectorAngle);

    // Fix: Calculate rotation to align target sector center with top (12h)
    // We need to consider the current wheel position after previous rotations
    const currentWheelPosition = rotation % 360;
    const currentWheelPositionNormalized =
      ((currentWheelPosition % 360) + 360) % 360;

    // Calculate where the target sector currently is relative to 12h
    const targetSectorCenter = targetAngleOffset + originalSectorAngle / 2;
    const targetCurrentPosition =
      (targetSectorCenter + currentWheelPositionNormalized) % 360;

    // Calculate how much we need to rotate to bring target to 12h (0°)
    // ✅ SỬA: Cần đảm bảo target sector center CHÍNH XÁC ở 0° (12h)
    let rotationNeeded = -targetCurrentPosition;

    // ✅ ĐIỀU CHỈNH: Để target center chính xác ở 12h (0°)
    // Bỏ randomExtraRotationWithinSector để test accuracy trước
    const newRotation = rotation + minRotations * 360 + rotationNeeded;

    console.log("Current wheel position:", currentWheelPositionNormalized);
    console.log("Target sector center (original):", targetSectorCenter);
    console.log("Target current position on wheel:", targetCurrentPosition);
    console.log("Rotation needed to align:", rotationNeeded);
    console.log("New total rotation:", newRotation);
    console.log(
      "Expected final position (should be near 0°):",
      newRotation % 360
    );
    console.log("============================");

    setRotation(newRotation);
    setRotationAtSpinTime(newRotation); // ✅ Lưu snapshot rotation

    // Đợi animation hoàn thành (5s) + buffer time (1s) để UI settle
    setTimeout(() => {
      setSpinning(false);
      setSelectedSector(targetSector);
      console.log("Live rotation:", rotation); // current (state, có thể sai)
      console.log("Snapshot rotation:", rotationAtSpinTime); // đúng lúc quay
      // Debug: Calculate which sector is actually at 12h position after rotation
      // Use the SAME snapshots for both calculation and verification
      // ✅ SỬA: Dùng newRotation (local variable) thay vì rotationAtSpinTime (state)
      const finalRotation = newRotation % 360; // ✅ Dùng local variable
      const normalizedRotation = ((finalRotation % 360) + 360) % 360; // Handle negative rotations

      // Use sectorsSnapshot (same data used for rotation calculation)
      const numSectors = sectorsSnapshot.length;
      const baseSectorAngle = 360 / numSectors;

      // Simple approach: find which sector contains the 0° position (12h pointer)
      const wheelOffset = (360 - normalizedRotation) % 360;
      const sectorAtTopIndex =
        Math.floor(wheelOffset / baseSectorAngle) % numSectors;
      const actualSectorAtTop = sectorsSnapshot[sectorAtTopIndex];

      console.log("=== DEBUG SPIN RESULT (with snapshots) ===");
      console.log("Final rotation (local variable mod 360):", finalRotation);
      console.log("Normalized rotation:", normalizedRotation);
      console.log("Wheel offset (reverse rotation):", wheelOffset);
      console.log("Sectors count (snapshot):", numSectors);
      console.log("Sector angle (snapshot):", baseSectorAngle);
      console.log("Calculated sector index at 12h:", sectorAtTopIndex);
      console.log("Actual sector at 12h:", actualSectorAtTop);
      console.log("Target sector (should win):", targetSector);
      console.log("Match?", actualSectorAtTop?.label === targetSector.label);
      console.log("==========================================");

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
    }, 7000); // 5s animation + 1s buffer để UI settle hoàn toàn
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
      <div className={styles.gameHeader}>
        <button className={styles.backButton} onClick={onBack}>
          ← Quay lại
        </button>
      </div>
      <h1 className="mb-20">{gameName}</h1>
      <div className={styles.wheelWrapper}>
        <div className={styles.pointerContainer}>
          <div className={styles.pointerShape}></div>
        </div>
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
            // Adjust the angle to align with sector center properly
            const sectorMidAngle =
              index * baseSectorAngle + baseSectorAngle / 2 - 90;

            return (
              <div
                key={`${sector.label}-${index}`}
                className={styles.sectorLabel}
                style={{
                  transform: `translate(-50%, -50%) rotate(${sectorMidAngle}deg)`,
                  color: sector.text || "white",
                }}
              >
                <div className={styles.sectorText}>{sector.label}</div>
              </div>
            );
          })}

          {/* Debug: Render sector boundary lines */}
          {/* Tạm thời tắt boundary lines để UI đẹp hơn */}
          {false &&
            availableSectors.map((_, index) => {
              const baseSectorAngle = 360 / availableSectors.length;
              const boundaryAngle = index * baseSectorAngle - 90; // -90 to align with 12h start

              return (
                <div
                  key={`boundary-${index}`}
                  className={styles.sectorBoundary}
                  style={{
                    transform: `translate(-50%, -50%) rotate(${boundaryAngle}deg)`,
                  }}
                />
              );
            })}
        </div>
      </div>

      <div className={styles.gameControls}>
        {!gameEnded ? (
          <button
            className={styles.spinButton}
            onClick={handleSpin}
            disabled={spinning || gameEnded}
          >
            {spinning ? "Đang quay..." : "QUAY NGAY!"}
          </button>
        ) : (
          <button
            className={styles.completeButton}
            onClick={() => onComplete && onComplete(gameEventId, totalScore)}
          >
            Hoàn thành - Nhận {totalScore} điểm
          </button>
        )}
        {/* <button className={styles.resetButton} onClick={resetGame}>
          Chơi lại
        </button> */}
      </div>

      <div className={styles.gameInfo}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Lượt quay còn lại:</span>
          <span className={styles.statValue}>{spinsLeft}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Tổng điểm:</span>
          <span className={styles.statValue}>{totalScore}</span>
        </div>
        {selectedSector && (
          <div className={styles.lastResult}>
            Kết quả: {selectedSector.label} (+{selectedSector.value || 0} điểm)
          </div>
        )}
        {gameEnded && (
          <div className={styles.gameOver}>
            🎉 Hoàn thành! Tổng điểm: {totalScore}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpinWheelUI;

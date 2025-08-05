import { useState, useEffect } from "react";
import styles from "./SpinWheel.module.css";

const SpinWheelUI = ({
  gameName,
  sectors: initialSectors,
  isDuplicate,
  maxSpin,
  gameEventId,
  onComplete,
}) => {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [spinsLeft, setSpinsLeft] = useState(maxSpin);
  const [totalScore, setTotalScore] = useState(0);
  const [availableSectors, setAvailableSectors] = useState(initialSectors);
  const [selectedSector, setSelectedSector] = useState(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [sectorsAtSpinTime, setSectorsAtSpinTime] = useState([]);
  const [rotationAtSpinTime, setRotationAtSpinTime] = useState(0);

  useEffect(() => {
    if (spinsLeft <= 0 && maxSpin > 0 && !gameCompleted) {
      setGameEnded(true);
      setGameCompleted(true);
      if (onComplete) {
        onComplete(gameEventId, totalScore);
      }
    }
  }, [spinsLeft, maxSpin, totalScore, onComplete, gameEventId, gameCompleted]);

  const handleSpin = () => {
    if (spinning || spinsLeft <= 0 || availableSectors.length === 0) {
      if (availableSectors.length === 0) setGameEnded(true);
      return;
    }

    setSpinning(true);
    setSelectedSector(null);

    const sectorsSnapshot = [...availableSectors];
    setSectorsAtSpinTime(sectorsSnapshot);
    const numSectors = sectorsSnapshot.length;
    const baseSectorAngle = 360 / numSectors;

    const targetIndex = Math.floor(Math.random() * numSectors);
    const targetSector = sectorsSnapshot[targetIndex];
    const targetOffset = targetIndex * baseSectorAngle;

    const minRotations = 5;
    const currentRotation = rotation % 360;
    const normalizedCurrentRotation = ((currentRotation % 360) + 360) % 360;
    const targetCenter = targetOffset + baseSectorAngle / 2;
    const targetCurrentPosition =
      (targetCenter + normalizedCurrentRotation) % 360;
    const rotationNeeded = -targetCurrentPosition;
    const newRotation = rotation + minRotations * 360 + rotationNeeded;

    setRotation(newRotation);
    setRotationAtSpinTime(newRotation);

    setTimeout(() => {
      setSpinning(false);
      setSelectedSector(targetSector);

      const finalRotation = newRotation % 360;
      const normalizedRotation = ((finalRotation % 360) + 360) % 360;
      const wheelOffset = (360 - normalizedRotation) % 360;
      const indexAtTop = Math.floor(wheelOffset / baseSectorAngle) % numSectors;
      const actualSectorAtTop = sectorsSnapshot[indexAtTop];

      setTotalScore((prev) => prev + (targetSector.value || 0));
      setSpinsLeft((prev) => prev - 1);

      if (!isDuplicate) {
        setAvailableSectors((prev) =>
          prev.filter(
            (s) =>
              !(
                s.label === targetSector.label && s.value === targetSector.value
              )
          )
        );
      }
    }, 7000); // 5s animation + 2s buffer
  };

  const getConicGradient = () => {
    if (availableSectors.length === 0)
      return "conic-gradient(#ccc 0deg 360deg)";

    let gradientString = "conic-gradient(";
    const baseAngle = 360 / availableSectors.length;
    let currentAngle = 0;

    availableSectors.forEach((sector, index) => {
      const start = currentAngle;
      const end = currentAngle + baseAngle;
      gradientString += `${sector.color} ${start}deg ${end}deg`;
      if (index < availableSectors.length - 1) gradientString += ", ";
      currentAngle = end;
    });

    gradientString += ")";
    return gradientString;
  };

  return (
    <div className={styles.spinWheelContainer}>
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
          {availableSectors.map((sector, index) => {
            const angle =
              index * (360 / availableSectors.length) +
              360 / availableSectors.length / 2 -
              90;
            return (
              <div
                key={`${sector.label}-${index}`}
                className={styles.sectorLabel}
                style={{
                  transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                  color: sector.text || "white",
                }}
              >
                <div className={styles.sectorText}>{sector.label}</div>
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
          {spinning ? "Đang quay..." : "QUAY NGAY!"}
        </button>
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

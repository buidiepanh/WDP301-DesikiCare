import React, { useRef, useState } from "react";
import "./SpinningWheel.css";

const SpinningWheel = ({ config }) => {
  const { sectors, maxSpin } = config;
  const wheelRef = useRef(null);
  const totalRotation = useRef(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const [result, setResult] = useState(null);
  const [resultHistory, setResultHistory] = useState([]);

  const spin = () => {
    if (isSpinning || spinCount >= maxSpin) return;

    const randomIndex = Math.floor(Math.random() * sectors.length);
    const degreesPerSector = 360 / sectors.length;
    const extraRotation =
      360 * 10 + (360 - randomIndex * degreesPerSector - degreesPerSector / 2);

    totalRotation.current += extraRotation;

    setIsSpinning(true);
    setResult(null);

    wheelRef.current.style.transition =
      "transform 5s cubic-bezier(0.33, 1, 0.68, 1)";
    wheelRef.current.style.transform = `rotate(${totalRotation.current}deg)`;

    setTimeout(() => {
      const normalizedRotation = totalRotation.current % 360;
      const degreesPerSector = 360 / sectors.length;

      const index = Math.floor((normalizedRotation % 360) / degreesPerSector);
      const selectedIndex = (sectors.length - index - 1) % sectors.length;

      const selected = sectors[selectedIndex].label;

      setIsSpinning(false);
      setSpinCount((prev) => prev + 1);
      setResult(selected);
      setResultHistory((prev) => [...prev, selected]);
    }, 5000);
  };

  return (
    <div className="wheel-container">
      <div className="wheel" ref={wheelRef}>
        {sectors.map((sector, i) => {
          const rotate = (360 / sectors.length) * i;
          return (
            <div
              key={i}
              className="sector"
              style={{
                transform: `rotate(${rotate}deg) skewY(-${
                  90 - 360 / sectors.length
                }deg)`,
                backgroundColor: sector.color,
                color: sector.text,
              }}
            >
              <span
                style={{
                  transform: `skewY(${90 - 360 / sectors.length}deg) rotate(${
                    360 / sectors.length / 2
                  }deg)`,
                }}
              >
                {sector.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="pointer" />
      <button
        className="spin-btn"
        onClick={spin}
        disabled={isSpinning || spinCount >= maxSpin}
      >
        Quay Ngay
      </button>

      {result && (
        <div className="result">
          <p>
            Kết quả vừa quay: <strong>{result}</strong>
          </p>

          <p>Kết quả sau {resultHistory.length} lượt quay:</p>
          <ul>
            {resultHistory.map((item, index) => (
              <li key={index}>
                Lượt {index + 1}: {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p>Lượt quay còn lại: {maxSpin - spinCount}</p>
    </div>
  );
};

export default SpinningWheel;

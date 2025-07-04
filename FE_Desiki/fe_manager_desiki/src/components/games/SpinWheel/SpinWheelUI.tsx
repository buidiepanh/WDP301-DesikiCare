import { Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import SpinWheel, { type Sector, type SpinWheelHandle } from "ts-spin-wheel";

type Props = {
  sectors: Sector[];
  isDuplicate: boolean;
  maxSpin: number;
};

export const SpinWheelUI: React.FC<Props> = ({
  sectors,
  isDuplicate,
  maxSpin,
}) => {
  // STATES
  const [spinCount, setSpinCount] = useState(0);
  const [wheelData, setWheelData] = useState<Sector[]>([]);

  // HOOKS
  const wheelRef = useRef<SpinWheelHandle>(null);

  useEffect(() => {
    if (sectors && sectors.length > 0) {
      setWheelData(sectors);
      setSpinCount(0);
    }
  }, [sectors]);

  const triggerSpin = () => {
    if (!wheelRef.current) return;
    if (spinCount >= maxSpin) return alert("Bạn đã dùng hết lượt quay!");

    wheelRef.current.spin();
    setSpinCount(spinCount + 1);
  };

  const handleSpinEnd = (winner?: Sector) => {
    if (!winner) {
      console.warn("Spin ended but no winner found.");
      return;
    }

    if (!isDuplicate) {
      setWheelData((prev) =>
        prev.filter((item) => item.label !== winner.label)
      );
    }
  };

  const resetGame = () => {
    setWheelData(sectors);
    setSpinCount(0);
  };

  return (
    <div className="w-full p-5 flex flex-col items-center">
      <p className="mb-20 text-yellow-400 text-2xl font-bold">
        Chào mừng đến với vòng quay!
      </p>

      {wheelData.length > 0 && (
        <SpinWheel
          ref={wheelRef}
          sectors={wheelData}
          size={350}
          onSpinEnd={handleSpinEnd}
          labelFontSize={12}
          spinButtonStyles={{
            display: "none",
          }}
          spinButtonArrowStyle={{
            top: "-9px",
            border: "8px solid transparent",
            borderBottomColor: "red",
          }}
          wheelBaseWidth="100%"
          wheelBaseBottom="4px"
          customModalContent={(winner, onClose) => (
            <div className="fixed inset-0 bg-cyan-200 bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-yellow-100 p-8 rounded-xl shadow-xl text-center">
                <h1 className="text-2xl font-bold text-green-700">
                  🌟 You got: {winner.label}
                </h1>
                <p className="mt-2">Enjoy your reward!</p>
                <button
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        />
      )}

      <p className="mt-20">Số lượt quay còn lại: {maxSpin - spinCount}</p>

      <div className="flex gap-4 mt-2">
        <Button
          disabled={spinCount >= maxSpin}
          variant="contained"
          color="success"
          onClick={triggerSpin}
        >
          Quay vòng quay
        </Button>
        <Button variant="outlined" color="error" onClick={resetGame}>
          Reset
        </Button>
      </div>
    </div>
  );
};

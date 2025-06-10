import React, { useRef, useState } from "react";
import ScratchCard from "react-scratchcard-v2";
import { Button } from "@mui/material";
import BackCoverImg from "../../../assets/TestScratch/backCoverImg.jpg";
interface CardConfig {
  label: string;
  imgBase64: string;
  point: number;
  text: string;
}

type Props = {
  numCards: number;
  cards: CardConfig[];
  backCoverImg: string;
  maxScratch: number;
};

export const ScratchCardUI: React.FC<Props> = ({
  numCards,
  cards,
  backCoverImg,
  maxScratch,
}) => {
  // State quản lý lượt cào đã dùng, điểm thưởng tích lũy, thẻ đã hoàn thành
  const [scratchCount, setScratchCount] = useState(0);
  const [totalPoint, setTotalPoint] = useState(0);
  const [doneIndices, setDoneIndices] = useState<number[]>([]);

  // Ref cho từng thẻ
  const refs = useRef<Array<ScratchCard | null>>(Array(numCards).fill(null));

  const onComplete = (index: number, point: number) => {
    if (doneIndices.includes(index)) return; // tránh trùng
    setDoneIndices((old) => [...old, index]);
    setTotalPoint((old) => old + point);
  };

  const handleScratch = () => {
    if (scratchCount >= maxScratch) {
      alert("Bạn đã dùng hết lượt cào!");
      return false;
    }
    setScratchCount((prev) => prev + 1);
    return true;
  };

  const handleReset = () => {
    setScratchCount(0);
    setTotalPoint(0);
    setDoneIndices([]);
    refs.current.forEach((ref) => ref?.reset());
  };

  return (
    <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
      {cards?.map((card, idx) => (
        <div key={idx} className="border rounded overflow-hidden relative">
          <ScratchCard
            ref={(el) => {
              refs.current[idx] = el;
            }}
            width={320}
            height={200}
            image={backCoverImg}
            finishPercent={60}
            onComplete={() => onComplete(idx, card.point)}
            brushSize={30}
            className="cursor-pointer"
            onScratch={() => handleScratch()}
          >
            <div className="w-full h-full flex flex-col items-center justify-center bg-white relative">
              <img
                src={card.imgBase64}
                alt={card.label}
                className="w-full h-full object-cover"
              />
              <p
                style={{ color: card.text }}
                className="absolute text-2xl mt-2 font-semibold"
              >
                {card.label}
              </p>
            </div>
          </ScratchCard>
        </div>
      ))}

      <div className="col-span-2 mt-4 flex flex-col items-center">
        <p>
          Tổng điểm nhận được: <strong>{totalPoint}</strong>
        </p>
        <p>
          Lượt cào: <strong>{scratchCount}</strong> / {maxScratch}
        </p>
        <Button
          variant="outlined"
          color="error"
          onClick={handleReset}
          className="mt-3"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import { ScratchCardUI } from "./ScratchCardUI";

interface CardConfig {
  label: string;
  img: string;
  point: number;
  text: string;
}

type ConfigJson = {
  cards: CardConfig[];
  maxScratch: number;
  backCoverImg: string;
};

type Props = {
  configJson: ConfigJson | null;
  setConfigJson: React.Dispatch<React.SetStateAction<ConfigJson | null>>;
};

const ScratchCardConfig: React.FC<Props> = ({ configJson, setConfigJson }) => {
  const [numCards, setNumCards] = useState(0);
  const [cards, setCards] = useState<CardConfig[]>([]);
  const [maxScratch, setMaxScratch] = useState(0);
  const [backCoverImg, setBackCoverImg] = useState("");
  const [showUI, setShowUI] = useState(false);

  // Đồng bộ lên configJson
  useEffect(() => {
    setConfigJson({
      cards,
      maxScratch,
      backCoverImg,
    });
  }, [cards, maxScratch, backCoverImg, setConfigJson]);

  // Khi số thẻ thay đổi, khởi tạo hoặc cắt bớt cards
  const handleNumCardsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (val < 0) return;
    setNumCards(val);

    if (val > cards.length) {
      setCards((old) => [
        ...old,
        ...Array(val - old.length).fill({ label: "", img: "", point: 0 }),
      ]);
    } else {
      setCards((old) => old.slice(0, val));
    }
  };

  const handleCardChange = (
    index: number,
    key: keyof CardConfig,
    value: string | number
  ) => {
    setCards((old) => {
      const newCards = [...old];
      newCards[index] = {
        ...newCards[index],
        [key]: value,
      };
      return newCards;
    });
  };

  return (
    <div className="bg-white p-4 flex flex-col">
      <p className="text-xl font-bold text-cyan-600">
        Config Scratch Card Game
      </p>

      <div className="my-5 grid grid-cols-2 gap-8">
        <div className="flex flex-col">
          <div>
            <p className="mb-3 font-semibold text-gray-700">Số lượng thẻ</p>
            <TextField
              value={numCards}
              type="number"
              onChange={handleNumCardsChange}
              inputProps={{ min: 0 }}
            />
          </div>

          <div className="mt-4">
            <p className="mb-3 font-semibold text-gray-700">
              Ảnh nền chung của các thẻ
            </p>
            <TextField
              value={backCoverImg}
              onChange={(e) => setBackCoverImg(e.target.value)}
              placeholder="URL ảnh nền chung"
            />
          </div>

          <div className="mt-4">
            <p className="mb-3 font-semibold text-gray-700">
              Số lượt cào tối đa
            </p>
            <TextField
              value={maxScratch}
              type="number"
              onChange={(e) => setMaxScratch(Number(e.target.value))}
              inputProps={{ min: 0 }}
            />
          </div>

          {/* Divider */}
          <div className="w-full flex items-center justify-center my-5">
            <div className="w-11/12 h-0.5 bg-gray-400"></div>
          </div>

          {/* Input chi tiết từng thẻ */}
          <div className="max-h-[450px] overflow-y-auto">
            {cards.map((card, index) => (
              <div
                key={index}
                className="mb-5 gap-3 p-3 bg-gray-100 rounded-md border border-gray-300"
              >
                <p className="font-bold mb-2">Thẻ #{index + 1}</p>
                <TextField
                  label="Nhãn"
                  fullWidth
                  value={card.label}
                  onChange={(e) =>
                    handleCardChange(index, "label", e.target.value)
                  }
                  className="mb-3"
                />
                <TextField
                  label="URL ảnh nền riêng"
                  fullWidth
                  value={card.img}
                  onChange={(e) =>
                    handleCardChange(index, "img", e.target.value)
                  }
                  className="mb-3"
                />
                <TextField
                  label="Điểm thưởng"
                  fullWidth
                  type="number"
                  value={card.point}
                  onChange={(e) =>
                    handleCardChange(index, "point", Number(e.target.value))
                  }
                />
                <TextField
                  label="Màu chữ"
                  fullWidth
                  type="color"
                  value={card.text}
                  onChange={(e) =>
                    handleCardChange(index, "text", e.target.value)
                  }
                />
              </div>
            ))}
          </div>

          <Button
            variant="contained"
            color="success"
            disabled={
              cards.length === 0 || cards.some((c) => !c.img || !c.label)
            }
            onClick={() => setShowUI(true)}
          >
            Test UI
          </Button>
        </div>

        {/* UI Demo */}
        <div className="w-full flex justify-center items-center">
          {showUI && configJson && (
            <ScratchCardUI
              numCards={numCards}
              cards={cards}
              backCoverImg={backCoverImg}
              maxScratch={maxScratch}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ScratchCardConfig;

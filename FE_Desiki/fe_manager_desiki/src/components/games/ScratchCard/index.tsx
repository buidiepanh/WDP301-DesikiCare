import React, { useState, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import ScratchCardUI from "./ScratchCardUI";
import type { GameConfigJson } from "../../../data/types";

interface Card {
  id: number;
  label: string;
  imgBase64: string;
  point: number;
  text: string;
}

type GameTypeImageBase64 = {
  id: number;
  imageBase64: string;
};

type Props = {
  configJson: GameConfigJson | null;
  setConfigJson: React.Dispatch<React.SetStateAction<GameConfigJson | null>>;
  gameTypeImageBase64s: GameTypeImageBase64[];
  handleUploadImages: (images: GameTypeImageBase64[]) => void;
};

const ScratchCardConfig: React.FC<Props> = ({
  configJson,
  setConfigJson,
  gameTypeImageBase64s,
  handleUploadImages,
}) => {
  const [numCards, setNumCards] = useState(0);
  const [cards, setCards] = useState<Card[]>([]);
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
  }, [cards, maxScratch, backCoverImg]);

  // Khi số thẻ thay đổi
  const handleNumCardsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (val < 0) return;
    setNumCards(val);

    const updated = Array.from({ length: val }, (_, i) => ({
      id: i + 1,
      label: cards[i]?.label || "",
      imgBase64: cards[i]?.imgBase64 || "",
      point: cards[i]?.point || 0,
      text: cards[i]?.text || "#000000",
    }));
    setCards(updated);
  };

  const handleCardChange = (
    index: number,
    key: keyof Card,
    value: string | number
  ) => {
    const updated = [...cards];
    updated[index] = {
      ...updated[index],
      [key]: value,
    };
    setCards(updated);
  };

  const handleUploadImage = (file: File, index: number) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;

      const updated = [...cards];
      updated[index] = {
        ...updated[index],
        imgBase64: base64,
      };
      setCards(updated);

      const newImages: GameTypeImageBase64[] = [
        ...gameTypeImageBase64s.filter((img) => img.id !== updated[index].id),
        { id: updated[index].id, imageBase64: base64 },
      ];
      handleUploadImages(newImages);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadBackCover = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setBackCoverImg(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white p-4 flex flex-col w-full">
      <p className="text-xl font-bold text-cyan-600">
        Config Scratch Card Game
      </p>

      <div className="my-5 flex flex-col items-start gap-8 w-full">
        <div className="flex flex-col w-full">
          <TextField
            label="Số lượng thẻ"
            value={numCards}
            type="number"
            onChange={handleNumCardsChange}
            inputProps={{ min: 0 }}
            className="mb-4"
          />

          <p className="mb-2 font-semibold text-gray-700">Ảnh nền chung</p>
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files && handleUploadBackCover(e.target.files[0])
              }
              className="hidden"
              id="back-cover-upload"
            />
            <label htmlFor="back-cover-upload">
              <Button
                variant="outlined"
                component="span"
                className="w-full"
                sx={{
                  textTransform: "none",
                  borderColor: "#e5e7eb",
                  color: "#374151",
                  "&:hover": {
                    borderColor: "#d1d5db",
                    backgroundColor: "#f9fafb",
                  },
                }}
              >
                📁 Chọn ảnh nền
              </Button>
            </label>
            {backCoverImg && (
              <img
                src={backCoverImg}
                alt="back-cover"
                className="w-32 h-32 object-cover mt-3 rounded border"
              />
            )}
          </div>

          <TextField
            label="Số lượt cào tối đa"
            value={maxScratch}
            type="number"
            onChange={(e) => setMaxScratch(Number(e.target.value))}
            inputProps={{ min: 0 }}
            className="mb-4"
          />

          <div className="w-full flex items-center justify-center my-5">
            <div className="w-11/12 h-0.5 bg-gray-400"></div>
          </div>

          <div className="max-h-[450px] overflow-y-auto">
            {cards.map((card, index) => (
              <div
                key={card.id}
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
                  sx={{ marginBottom: "10px" }}
                />
                <div className="mb-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files &&
                      handleUploadImage(e.target.files[0], index)
                    }
                    className="hidden"
                    id={`card-image-upload-${index}`}
                  />
                  <label htmlFor={`card-image-upload-${index}`}>
                    <Button
                      variant="outlined"
                      component="span"
                      size="small"
                      sx={{
                        textTransform: "none",
                        borderColor: "#e5e7eb",
                        color: "#374151",
                        "&:hover": {
                          borderColor: "#d1d5db",
                          backgroundColor: "#f9fafb",
                        },
                      }}
                    >
                      🖼️ Chọn ảnh thẻ
                    </Button>
                  </label>
                </div>
                {card.imgBase64 && (
                  <img
                    src={card.imgBase64}
                    alt={`card-${index}`}
                    className="w-24 h-24 object-cover mb-3 rounded"
                  />
                )}
                <TextField
                  label="Điểm thưởng"
                  fullWidth
                  type="number"
                  value={card.point}
                  onChange={(e) =>
                    handleCardChange(index, "point", Number(e.target.value))
                  }
                  sx={{ marginBottom: "10px" }}
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
            disabled={cards.length === 0 || cards.some((c) => !c.imgBase64)}
            onClick={() => setShowUI(true)}
          >
            Test UI
          </Button>
        </div>

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

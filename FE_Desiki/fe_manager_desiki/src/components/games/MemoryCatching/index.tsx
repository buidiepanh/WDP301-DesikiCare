import { useState, useEffect } from "react";
import { Button, TextField } from "@mui/material";

import type { GameConfigJson } from "../../../data/types";
import MemoryCatchingUI from "./MemoryCatchingUI";

interface Pair {
  id: number;
  imageBase64: string;
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

const MemoryCatchingConfig: React.FC<Props> = ({
  configJson,
  setConfigJson,
  // gameTypeImageBase64s,
  handleUploadImages,
}) => {
  const [numOfPairs, setNumOfPairs] = useState(0);
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [originalPoint, setOriginalPoint] = useState(0);
  const [minusPoint, setMinusPoint] = useState(0);
  const [backCoverImg, setBackCoverImg] = useState("");
  const [showUI, setShowUI] = useState(false);

  // Đồng bộ configJson
  useEffect(() => {
    setConfigJson({
      pairs,
      numOfPairs,
      originalPoint,
      minusPoint,
      backCoverImg,
    });
  }, [pairs, numOfPairs, originalPoint, minusPoint, backCoverImg]);

  // Tạo hoặc cắt pairs theo số lượng
  const handleNumOfPairsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (val < 0) return;
    setNumOfPairs(val);
    const updated = Array.from({ length: val }, (_, i) => ({
      id: i + 1,
      imageBase64: pairs[i]?.imageBase64 || "",
    }));
    setPairs(updated);
  };

  // Xử lý khi upload ảnh (chuyển base64)
  const handleUploadImage = (file: File, index: number) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;

      // Cập nhật pair (với id)
      const updatedPairs = [...pairs];
      updatedPairs[index] = { id: index + 1, imageBase64: base64 };
      setPairs(updatedPairs);

      // Cập nhật gameTypeImageBase64s dùng callback
      handleUploadImages(updatedPairs);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadBackCoverImg = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setBackCoverImg(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white w-full p-4 flex flex-col">
      <p className="text-xl font-bold text-cyan-600">
        Config Memory Catching Game
      </p>

      <div className="my-5 flex flex-col items-start gap-8">
        <div className="w-full flex flex-col">
          <TextField
            label="Số lượng cặp ô"
            value={numOfPairs}
            type="number"
            onChange={handleNumOfPairsChange}
            inputProps={{ min: 0 }}
            sx={{ marginBottom: "20px" }}
          />
          <TextField
            label="Điểm gốc"
            value={originalPoint}
            type="number"
            onChange={(e) => setOriginalPoint(Number(e.target.value))}
            sx={{ marginBottom: "20px" }}
          />
          <TextField
            label="Điểm trừ"
            value={minusPoint}
            type="number"
            onChange={(e) => setMinusPoint(Number(e.target.value))}
            sx={{ marginBottom: "20px" }}
          />
          <p className="font-bold mb-2">Ảnh nền của thẻ</p>
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files && handleUploadBackCoverImg(e.target.files[0])
              }
              className="hidden"
              id="memory-back-cover-upload"
            />
            <label htmlFor="memory-back-cover-upload">
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
                📁 Chọn ảnh nền của thẻ
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

          <div className="w-full flex items-center justify-center my-4">
            <div className="w-11/12 h-0.5 bg-gray-400"></div>
          </div>

          <div className="max-h-[450px] w-full overflow-y-scroll">
            {pairs.map((pair, index) => (
              <div key={pair.id} className="bg-gray-100 p-3 rounded mb-4">
                <p className="font-bold mb-2">Ô #{index + 1}</p>
                <div className="mb-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files &&
                      handleUploadImage(e.target.files[0], index)
                    }
                    className="hidden"
                    id={`memory-pair-upload-${index}`}
                  />
                  <label htmlFor={`memory-pair-upload-${index}`}>
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
                      🖼️ Chọn ảnh cặp
                    </Button>
                  </label>
                </div>
                {pair.imageBase64 && (
                  <img
                    src={pair.imageBase64}
                    alt={`pair-${index}`}
                    className="mt-2 w-24 h-24 object-cover rounded"
                  />
                )}
              </div>
            ))}
          </div>

          <Button
            variant="contained"
            color="success"
            className="mt-4"
            onClick={() => setShowUI(true)}
            disabled={pairs.length === 0 || pairs.some((p) => !p.imageBase64)}
          >
            Test UI
          </Button>
        </div>

        <div className="w-full flex justify-center items-center">
          {showUI && configJson && (
            <MemoryCatchingUI
              numOfPairs={configJson.numOfPairs}
              pairs={configJson.pairs}
              backCoverImg={configJson.backCoverImg}
              originalPoint={configJson.originalPoint}
              minusPoint={configJson.minusPoint}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MemoryCatchingConfig;

import { useState, useEffect } from "react";
import { Button, TextField, Checkbox } from "@mui/material";
import { MemoryCatchingUI } from "./MemoryCatchingUI";

interface Pair {
  img_url: string;
}

type ConfigJson = {
  pairs: Pair[];
  numOfPairs: number;
  originalPoint: number;
  minusPoint: number;
  backCoverImg: string;
};

type Props = {
  configJson: ConfigJson | null;
  setConfigJson: React.Dispatch<React.SetStateAction<ConfigJson | null>>;
};

const MemoryCatchingConfig: React.FC<Props> = ({
  configJson,
  setConfigJson,
}) => {
  const [numOfPairs, setNumOfPairs] = useState(0);
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [originalPoint, setOriginalPoint] = useState(0);
  const [minusPoint, setMinusPoint] = useState(0);
  const [backCoverImg, setBackCoverImg] = useState("");
  const [showUI, setShowUI] = useState(false);

  // Đồng bộ configJson khi state thay đổi
  useEffect(() => {
    setConfigJson({
      pairs,
      numOfPairs,
      originalPoint,
      minusPoint,
      backCoverImg,
    });
  }, [
    pairs,
    numOfPairs,
    originalPoint,
    minusPoint,
    backCoverImg,
    setConfigJson,
  ]);

  // Khi số cặp thay đổi
  const handleNumOfPairsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (val < 0) return;
    setNumOfPairs(val);

    // Tạo hoặc cắt pairs cho phù hợp
    if (val > pairs.length) {
      setPairs((old) => [
        ...old,
        ...Array(val - old.length).fill({ img_url: "" }),
      ]);
    } else {
      setPairs((old) => old.slice(0, val));
    }
  };

  const handlePairImgChange = (index: number, value: string) => {
    setPairs((old) => {
      const newPairs = [...old];
      newPairs[index] = { img_url: value };
      return newPairs;
    });
  };

  return (
    <div className="bg-white p-4 flex flex-col">
      <p className="text-xl font-bold text-cyan-600">
        Config Memory Catching Game
      </p>

      <div className="my-5 grid grid-cols-2">
        <div className="w-full flex flex-col">
          {/* Number Of Pairs */}
          <div className="mt-3 flex flex-col mr-5">
            <p className="mb-3 font-semibold text-gray-700">
              Số lượng cặp ô của trò chơi
            </p>
            <TextField
              value={numOfPairs}
              type="number"
              onChange={handleNumOfPairsChange}
              inputProps={{ min: 0 }}
            />
          </div>

          {/* Original Point */}
          <div className="mt-3 flex flex-col mr-5">
            <p className="mb-3 font-semibold text-gray-700">Điểm gốc</p>
            <TextField
              value={originalPoint}
              type="number"
              onChange={(e) => setOriginalPoint(Number(e.target.value))}
              inputProps={{ min: 0 }}
            />
          </div>

          {/* Minus Point */}
          <div className="mt-3 flex flex-col mr-5">
            <p className="mb-3 font-semibold text-gray-700">Điểm trừ</p>
            <TextField
              value={minusPoint}
              type="number"
              onChange={(e) => setMinusPoint(Number(e.target.value))}
              inputProps={{ min: 0 }}
            />
          </div>

          {/* Back Cover Image */}
          <div className="mt-3 flex flex-col mr-5">
            <p className="mb-3 font-semibold text-gray-700">Ảnh nền của ô</p>
            <TextField
              value={backCoverImg}
              onChange={(e) => setBackCoverImg(e.target.value)}
            />
          </div>

          {/* Divider */}
          <div className="w-full flex items-center justify-center my-5">
            <div className="w-11/12 h-0.5 bg-gray-400"></div>
          </div>

          {/* Pairs's Input */}
          <div className="mt-3 flex flex-col mr-5 h-[450px] overflow-y-scroll p-2">
            {pairs.map((pair, index) => (
              <div
                key={index}
                className="flex flex-col my-3 bg-gray-100 rounded-sm"
              >
                <div className="bg-gray-800 rounded-t-sm flex items-center pl-3 mb-5">
                  <p className="font-bold text-white">Ô #{index + 1}</p>
                </div>
                <div className="grid grid-cols-4 gap-5 mb-2 px-2">
                  <div className="col-span-1 flex items-center">
                    <p>Ảnh của cặp ô</p>
                  </div>
                  <div className="col-span-3">
                    <TextField
                      fullWidth
                      value={pair.img_url}
                      onChange={(e) =>
                        handlePairImgChange(index, e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Button test UI */}
          <Button
            variant="contained"
            color="success"
            onClick={() => setShowUI(true)}
            disabled={pairs.length === 0 || pairs.some((p) => !p.img_url)}
          >
            Test UI
          </Button>
        </div>

        {/* Demo UI */}
        <div className="w-full flex flex-col items-center">
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

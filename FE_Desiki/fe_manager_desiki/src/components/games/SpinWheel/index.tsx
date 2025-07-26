import { Checkbox, TextField, Button } from "@mui/material";
import React, { useEffect, useState } from "react";

import type { GameConfigJson } from "../../../data/types";
import SpinWheelUI from "./SpinWheelUI";

interface Segment {
  value: number;
  label: string;
  color: string;
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

const SpinWheelConfig: React.FC<Props> = ({
  configJson,
  setConfigJson,
  // gameTypeImageBase64s,
  // handleUploadImages,
}) => {
  const [showUI, setShowUI] = useState(false);

  useEffect(() => {
    const isEmptyObject =
      configJson &&
      Object.keys(configJson).length === 0 &&
      configJson.constructor === Object;

    if (!configJson || isEmptyObject) {
      setConfigJson({
        numOfSectors: 0,
        maxSpin: 0,
        isDuplicate: false,
        sectors: [],
      });
    } else {
      console.log("Config Json:", configJson);
    }
  }, [configJson, setConfigJson]);

  const handleNumOfSectorsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (val > 12) return;

    const oldSectors = configJson?.sectors || [];
    let newSectors: Segment[] = [];

    if (val > oldSectors.length) {
      newSectors = [
        ...oldSectors,
        ...Array(val - oldSectors.length).fill({
          value: 0,
          label: "",
          color: "#ffffff",
          text: "",
        }),
      ];
    } else {
      newSectors = oldSectors.slice(0, val);
    }

    setConfigJson({
      ...configJson,
      numOfSectors: val,
      sectors: newSectors,
    });
  };

  const handleSectorChange = (
    index: number,
    key: keyof Segment,
    value: any
  ) => {
    if (!configJson) return;
    const sectors = [...(configJson.sectors || [])];
    sectors[index] = {
      ...sectors[index],
      [key]: value,
    };
    setConfigJson({
      ...configJson,
      sectors,
    });
  };

  const handleMaxSpinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const max = Number(e.target.value);
    setConfigJson({
      ...configJson,
      maxSpin: max,
    });
  };

  const handleIsDuplicateChange = () => {
    const newVal = !configJson?.isDuplicate;
    setConfigJson({
      ...configJson,
      isDuplicate: newVal,
    });
  };

  return (
    <div className="bg-white p-4 flex flex-col">
      <p className="text-xl font-bold text-cyan-600">Config Spin Wheel Game</p>

      <div className="my-5 flex flex-col items-center gap-10">
        <div className="w-full flex flex-col">
          <div className="mt-3 flex flex-col mr-5">
            <p className="mb-3 font-semibold text-gray-700">
              Số lượng ô của vòng quay (max 12 ô)
            </p>
            <TextField
              value={configJson?.numOfSectors || 0}
              type="number"
              onChange={handleNumOfSectorsChange}
            />
          </div>

          <div className="mt-3 flex flex-col mr-5">
            <p className="mb-3 font-semibold text-gray-700">
              Số lượt quay tối đa
            </p>
            <TextField
              value={configJson?.maxSpin || 0}
              type="number"
              onChange={handleMaxSpinChange}
            />
          </div>

          <div className="mt-3 flex items-center mr-5">
            <p className="font-semibold text-gray-700">
              Giữ giải thưởng sau khi quay trúng ?
            </p>
            <Checkbox
              checked={configJson?.isDuplicate || false}
              onChange={handleIsDuplicateChange}
            />
          </div>

          <div className="w-full flex items-center justify-center my-5">
            <div className="w-11/12 h-0.5 bg-gray-400"></div>
          </div>

          <div className="my-3 flex flex-col mr-5 max-h-[450px] overflow-y-scroll p-2">
            {configJson?.sectors?.map((sector: Segment, index: number) => (
              <div
                key={index}
                className="flex flex-col my-3 bg-gray-100 rounded-sm"
              >
                <div className="bg-gray-800 rounded-t-sm flex items-center pl-3 mb-5">
                  <p className="font-bold text-white">Ô #{index + 1}</p>
                </div>

                <div className="grid grid-cols-4 gap-5 mb-2 px-2">
                  <div className="col-span-1 flex items-center">
                    <p>Giá trị điểm thưởng</p>
                  </div>
                  <div className="col-span-3">
                    <TextField
                      fullWidth
                      type="number"
                      value={sector.value}
                      onChange={(e) =>
                        handleSectorChange(
                          index,
                          "value",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-5 mb-2 px-2">
                  <div className="col-span-1 flex items-center">
                    <p>Nhãn của ô</p>
                  </div>
                  <div className="col-span-3">
                    <TextField
                      fullWidth
                      value={sector.label}
                      onChange={(e) =>
                        handleSectorChange(index, "label", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-5 mb-2 px-2">
                  <div className="col-span-1 flex items-center">
                    <p>Màu nền</p>
                  </div>
                  <div className="col-span-3">
                    <TextField
                      type="color"
                      fullWidth
                      value={sector.color}
                      onChange={(e) =>
                        handleSectorChange(index, "color", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-5 mb-2 px-2">
                  <div className="col-span-1 flex items-center">
                    <p>Màu chữ</p>
                  </div>
                  <div className="col-span-3">
                    <TextField
                      type="color"
                      fullWidth
                      value={sector.text}
                      onChange={(e) =>
                        handleSectorChange(index, "text", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="contained"
            color="success"
            onClick={() => setShowUI(true)}
            disabled={!configJson || configJson?.sectors?.length === 0}
          >
            Test UI
          </Button>
        </div>

        <div className="w-full">
          {showUI && configJson?.sectors?.length > 0 && (
            <SpinWheelUI
              sectors={configJson?.sectors || []}
              isDuplicate={configJson?.isDuplicate || false}
              maxSpin={configJson?.maxSpin || 0}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SpinWheelConfig;

import { Checkbox, TextField, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { SpinWheelUI } from "./SpinWheelUI";

interface Segment {
  value: number;
  label: string;
  color: string;
  text: string;
}

type ConfigJson = {
  sectors: Segment[];
  maxSpin: number;
  isDuplicate: boolean;
};

type Props = {
  configJson: ConfigJson | null;
  setConfigJson: React.Dispatch<React.SetStateAction<ConfigJson | null>>;
};

const SpinWheelConfig: React.FC<Props> = ({ configJson, setConfigJson }) => {
  // States riêng để điều khiển UI
  const [numOfSectors, setNumOfSectors] = useState(0);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [maxSpin, setMaxSpin] = useState(0);

  // Test UI state
  const [showUI, setShowUI] = useState(false);

  // Khi configJson thay đổi thì đồng bộ lên state UI
  useEffect(() => {
    if (configJson) {
      setNumOfSectors(configJson.sectors?.length || 0);
      setMaxSpin(configJson.maxSpin || 0);
      setIsDuplicate(configJson.isDuplicate || false);
    }
  }, [configJson]);

  // Cập nhật số lượng sectors, tự động tạo mảng sectors mới nếu tăng
  const handleNumOfSectorsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (val > 12) return;
    setNumOfSectors(val);

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
      sectors: newSectors,
    });
  };

  // Cập nhật thông tin sector tại vị trí index
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

  // Cập nhật maxSpin và isDuplicate
  const handleMaxSpinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxSpin(Number(e.target.value));
    setConfigJson({
      ...configJson,
      maxSpin: Number(e.target.value),
    });
  };

  const handleIsDuplicateChange = () => {
    setIsDuplicate(!isDuplicate);
    setConfigJson({
      ...configJson,
      isDuplicate: !isDuplicate,
    });
  };

  return (
    <div className="bg-white p-4 flex flex-col">
      {/* HEADER */}
      <p className="text-xl font-bold text-cyan-600">Config Spin Wheel Game</p>

      {/* CONFIG AREA */}
      <div className="my-5 grid grid-cols-2">
        {/* INPUT AREA */}
        <div className="w-full flex flex-col">
          {/* Number Of Sectors */}
          <div className="mt-3 flex flex-col mr-5">
            <p className="mb-3 font-semibold text-gray-700">
              Số lượng ô của vòng quay (max 12 ô)
            </p>
            <TextField
              value={numOfSectors}
              type="number"
              onChange={handleNumOfSectorsChange}
            />
          </div>

          {/* Number Of Spin Turn */}
          <div className="mt-3 flex flex-col mr-5">
            <p className="mb-3 font-semibold text-gray-700">
              Số lượt quay tối đa
            </p>
            <TextField
              value={maxSpin}
              type="number"
              onChange={handleMaxSpinChange}
            />
          </div>

          {/* Is Deleted After Reward */}
          <div className="mt-3 flex items-center mr-5">
            <p className="font-semibold text-gray-700">
              Giữ giải thưởng sau khi quay trúng ?
            </p>
            <Checkbox
              checked={isDuplicate}
              onChange={handleIsDuplicateChange}
            />
          </div>

          {/* Divider */}
          <div className="w-full flex items-center justify-center my-5">
            <div className="w-11/12 h-0.5 bg-gray-400"></div>
          </div>

          {/* Sectors's Input */}
          <div className="mt-3 flex flex-col mr-5 h-[450px] overflow-y-scroll p-2">
            {configJson?.sectors?.map((sector, index) => (
              <div
                key={index}
                className="flex flex-col my-3 bg-gray-100 rounded-sm "
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

          {/* BUTTON TEST UI */}
          <Button
            variant="contained"
            color="success"
            onClick={() => setShowUI(true)}
            disabled={!configJson || configJson.sectors.length === 0}
          >
            Test UI
          </Button>
        </div>

        {/* DEMO UI */}
        <div>
          {showUI && configJson?.sectors?.length > 0 && (
            <SpinWheelUI
              sectors={configJson.sectors.map(({ value, ...rest }) => rest)}
              isDuplicate={configJson.isDuplicate || false}
              maxSpin={configJson.maxSpin || 0}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SpinWheelConfig;

import React from "react";
import SpinWheelConfig from "../../components/games/SpinWheel";
import MemoryCatchingConfig from "../../components/games/MemoryCatching";
import ScratchCardConfig from "../../components/games/ScratchCard";
import MissingWordsConfig from "../../components/games/MissingWord";

// Import các game khác tương tự...

type ConfigJson = {
  [key: string]: any;
};

type Props = {
  gameTypeId: number;
  configJson: ConfigJson | null;
  setConfigJson: React.Dispatch<React.SetStateAction<ConfigJson | null>>;
};

const GameConfigLoader: React.FC<Props> = ({
  gameTypeId,
  configJson,
  setConfigJson,
}) => {
  switch (gameTypeId) {
    case 1:
      return (
        <SpinWheelConfig
          configJson={configJson}
          setConfigJson={setConfigJson}
        />
      );
    case 2:
      return (
        <MemoryCatchingConfig
          configJson={configJson}
          setConfigJson={setConfigJson}
        />
      );
    case 3:
      return (
        <ScratchCardConfig
          configJson={configJson}
          setConfigJson={setConfigJson}
        />
      );
    case 4:
      return (
        <MissingWordsConfig
          configJson={configJson}
          setConfigJson={setConfigJson}
        />
      );
    default:
      return <p>Chọn loại game để cấu hình.</p>;
  }
};

export default GameConfigLoader;

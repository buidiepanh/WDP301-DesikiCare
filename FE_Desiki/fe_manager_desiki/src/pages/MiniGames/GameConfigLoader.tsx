import React from "react";
import SpinWheelConfig from "../../components/games/SpinWheel";
import MemoryCatchingConfig from "../../components/games/MemoryCatching";
import ScratchCardConfig from "../../components/games/ScratchCard";
import MissingWordsConfig from "../../components/games/MissingWord";

type ConfigJson = {
  [key: string]: any;
};

interface GameTypeImageBase64 {
  id: number;
  imageBase64: string;
}

interface GameConfigLoaderProps {
  gameTypeId: number;
  configJson: ConfigJson;
  setConfigJson: React.Dispatch<React.SetStateAction<ConfigJson | null>>;
  gameTypeImageBase64s: GameTypeImageBase64[];
  handleUploadImages: (images: GameTypeImageBase64[]) => void;
}

const GameConfigLoader: React.FC<GameConfigLoaderProps> = ({
  gameTypeId,
  configJson,
  gameTypeImageBase64s,
  handleUploadImages,
  setConfigJson,
}) => {
  switch (gameTypeId) {
    case 1:
      return (
        <SpinWheelConfig
          configJson={configJson}
          setConfigJson={setConfigJson}
          gameTypeImageBase64s={gameTypeImageBase64s}
          handleUploadImages={handleUploadImages}
        />
      );
    case 2:
      return (
        <MemoryCatchingConfig
          configJson={configJson}
          setConfigJson={setConfigJson}
          gameTypeImageBase64s={gameTypeImageBase64s}
          handleUploadImages={handleUploadImages}
        />
      );
    case 3:
      return (
        <ScratchCardConfig
          configJson={configJson}
          setConfigJson={setConfigJson}
          gameTypeImageBase64s={gameTypeImageBase64s}
          handleUploadImages={handleUploadImages}
        />
      );
    case 4:
      return (
        <MissingWordsConfig
          configJson={configJson}
          setConfigJson={setConfigJson}
          gameTypeImageBase64s={gameTypeImageBase64s}
          handleUploadImages={handleUploadImages}
        />
      );
    default:
      return <p>Chọn loại game để cấu hình.</p>;
  }
};

export default GameConfigLoader;

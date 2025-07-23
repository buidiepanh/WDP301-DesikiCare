import "./styles.css";

type ConfigJson = {
  [key: string]: any;
};

type GameTypeImageBase64 = {
  id: number;
  imageBase64: string;
};

type Props = {
  configJson: ConfigJson | null;
  setConfigJson: React.Dispatch<React.SetStateAction<ConfigJson | null>>;
  gameTypeImageBase64s: GameTypeImageBase64[];
  handleUploadImages: (images: GameTypeImageBase64[]) => void;
};

const MissingWordsConfig: React.FC<Props> = (
  {
    // configJson,
    // setConfigJson,
    // gameTypeImageBase64s,
    // handleUploadImages,
  }
) => {
  return (
    <div className="flex flex-col items-center gap-8">
      <p>This Game Will Coming Soon...</p>
    </div>
  );
};

export default MissingWordsConfig;

import "./styles.css";

type ConfigJson = {
  [key: string]: any;
};

type Props = {
  configJson: ConfigJson | null;
  setConfigJson: React.Dispatch<React.SetStateAction<ConfigJson | null>>;
};

const MemoryCatchingConfig: React.FC<Props> = ({
  configJson,
  setConfigJson,
}) => {
  return <div>Hello</div>;
};

export default MemoryCatchingConfig;

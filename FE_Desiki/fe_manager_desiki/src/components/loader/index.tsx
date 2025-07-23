import "./styles.css";

const HasikiLoader = () => {
  return (
    <div className="cube-loader">
      <div className="cube-top"></div>
      <div className="cube-wrapper">
        <span
          style={{ "--i": 0 } as React.CSSProperties}
          className="cube-span"
        ></span>
        <span
          style={{ "--i": 1 } as React.CSSProperties}
          className="cube-span"
        ></span>
        <span
          style={{ "--i": 2 } as React.CSSProperties}
          className="cube-span"
        ></span>
        <span
          style={{ "--i": 3 } as React.CSSProperties}
          className="cube-span"
        ></span>
      </div>
    </div>
  );
};

export default HasikiLoader;

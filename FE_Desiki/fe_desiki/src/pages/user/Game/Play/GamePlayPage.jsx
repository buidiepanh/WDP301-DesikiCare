import React from "react";
import { useLocation } from "react-router-dom";
import SpinningWheel from "../Spinning/SpinningWheel";

const GamePlayPage = () => {
  const { state } = useLocation(); // chứa event data
  const { gameEvent } = state;
  const { configJson } = gameEvent;

  const renderGameByType = () => {
    switch (gameEvent.gameTypeId) {
      case 1:
        return <SpinningWheel config={configJson} />;
      default:
        return <div>Chưa hỗ trợ loại game này</div>;
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>{gameEvent.eventName}</h2>
      {renderGameByType()}
    </div>
  );
};

export default GamePlayPage;

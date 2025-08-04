"use client";
import { useState } from "react";
import "./styles.css";

type GameConfigJson = {
  backCoverImg: string; //Image URL for the back of Card
  maxScratch: number; //Số lần cào tối đa
  cards: {
    id: number; //index 1-2-3-4-...
    imgBase64: string; //Base64 image data for the card front
    label: string; //Label text for the card
    point: number; //Points value for the card
    text: string; //Text color for the card label
  }[];
};

type GameEvent = {
  gameEvent: {
    _id: string;
    balancePoints: number;
    configJson: GameConfigJson;
    eventName: string;
    gameName: string;
    gameTypeId: number;
    imageUrl: string;
    description: string;
    isDeactivated: boolean;
    endDate: string; //Format: "2023-10-31T23:59:59.999Z"
    startDate: string; //Format: "2023-10-01T00:00:00.000Z"
    createdAt: string; //Format: "2023-10-01T00:00:00.000Z"
    updatedAt: string; //Format: "2023-10-01T00:00:00.000Z"
  };
  gameEventRewardResults: any;
  gameTypeImageUrls: {
    id: string; //index 1-2-3-4-...
    imageUrl: string;
  }[];
};

interface Props {
  gameEvent: GameEvent;
  onFinish: () => void;
}

export const ScratchCardGame = ({ gameEvent, onFinish }: Props) => {
  // STATES
  const [finalPoints, setFinalPoints] = useState(0);

  return (
    <div>
      <h2>{gameEvent.gameEvent.eventName}</h2>
      {/* Render scratch card UI */}
      <button onClick={onFinish}>Finish Game</button>
    </div>
  );
};

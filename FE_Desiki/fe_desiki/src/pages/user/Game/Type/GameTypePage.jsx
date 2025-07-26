import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { getGamesEvent } from "../../../../services/apiServices";

const GameTypePage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchGameEvents();
  }, [state]);

  const fetchGameEvents = async () => {
    try {
      const result = await getGamesEvent();
      console.log(result);
      const filtered = result.gameEvents.filter(
        (event) => event.gameEvent.gameTypeId === state._id
      );
      setEvents(filtered);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Chọn một sự kiện cho game: {state.name}
      </Typography>

      {events.map((item) => (
        <Card
          key={item.gameEvent._id}
          sx={{ mb: 2, display: "flex", cursor: "pointer" }}
          onClick={() =>
            navigate(`/game-event/${item.gameEvent._id}`, { state: item })
          }
        >
          <CardMedia
            component="img"
            image={item.gameEvent.imageUrl}
            alt="event"
            sx={{ width: 100 }}
          />
          <CardContent>
            <Typography variant="h6">{item.gameEvent.eventName}</Typography>
            <Typography variant="body2">
              {item.gameEvent.description}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default GameTypePage;

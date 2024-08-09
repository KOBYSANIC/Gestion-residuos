import React from "react";

import {
  EN_RUTA,
  event_state,
  FINALIZADO,
  PROCESO,
} from "../../Utils/constants";

import Badge from "./Badge";

const BadgeStateEvent = ({ state_event }) => {
  return (
    <Badge
      colorScheme={
        state_event === PROCESO
          ? "blue"
          : state_event === EN_RUTA
          ? "purple"
          : state_event === FINALIZADO
          ? "green"
          : "red"
      }
      textContent={state_event ? event_state[state_event - 1].label : "---"}
    />
  );
};

export default BadgeStateEvent;

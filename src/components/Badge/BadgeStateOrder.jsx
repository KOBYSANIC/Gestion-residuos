import React, { Fragment } from "react";

import {
  GENERADO,
  ENVIADO,
  ENTREGADO,
  order_state,
} from "../../Utils/constants";

import Badge from "./Badge";

const BadgeStateOrder = ({
  state_order,
  order_chat,
  show_badge_order = false,
}) => {
  return (
    <Fragment>
      <Badge
        colorScheme={
          state_order === GENERADO
            ? "blue"
            : state_order === ENVIADO
            ? "purple"
            : state_order === ENTREGADO
            ? "green"
            : "red"
        }
        textContent={state_order ? order_state[state_order - 1].label : "---"}
      />

      {show_badge_order && (
        <Badge
          ml="5"
          colorScheme={order_chat ? "yellow" : "purple"}
          textContent={
            order_chat
              ? "Generar pedido vía whatsapp"
              : "No generar pedido vía whatsapp"
          }
        />
      )}
    </Fragment>
  );
};

export default BadgeStateOrder;

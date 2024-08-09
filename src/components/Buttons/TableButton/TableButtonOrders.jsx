import React from "react";
import TableButton from "./TableButton";
import { MenuItem, MenuList } from "@chakra-ui/react";

import { useDispatch } from "react-redux";
import {
  getOrder,
  setOrderSelected,
} from "../../../redux/features/orderSlice";
import {
  CANCELADO,
  GENERADO,
  ENVIADO,
} from "../../../Utils/constants";
import { onOpenModal } from "../../../redux/features/modalOrderSlice";

const TableButtonOrders = ({ row, onClick }) => {
  const dispatch = useDispatch();
  const onOpenModalViewOrder = () => dispatch(onOpenModal());

  const { order_state } = row.values;

  const handleOnClick = (isCancell = false) => {
    onClick();
    const values = { ...row.values, isCancell };
    dispatch(setOrderSelected(values));
  };

  const handleViewEvent = () => {
    const { id: order_id } = row.values;
    dispatch(getOrder(order_id));
    onOpenModalViewOrder(true);
  };

  return (
    <TableButton>
      <MenuList>
        <MenuItem onClick={handleViewEvent}>Ver orden</MenuItem>
        {order_state === GENERADO && (
          <MenuItem onClick={() => handleOnClick(false)}>
            Marcar como Enviado
          </MenuItem>
        )}

        {order_state === ENVIADO && (
          <MenuItem onClick={() => handleOnClick(false)}>
            Marcar como Entregado
          </MenuItem>
        )}

        {order_state !== CANCELADO && (
          <MenuItem onClick={() => handleOnClick(true)}>
            Cancelar orden
          </MenuItem>
        )}
      </MenuList>
    </TableButton>
  );
};

export default TableButtonOrders;

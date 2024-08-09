import React from "react";
import TableButton from "./TableButton";
import { MenuItem, MenuList } from "@chakra-ui/react";
import {
  CANCELADO,
  EN_RUTA,
  FINALIZADO,
  PROCESO,
} from "../../../Utils/constants";
import {
  getEvent,
  setEventSelected,
  setIsUpdate,
} from "../../../redux/features/eventSlice";
import { useDispatch } from "react-redux";
import { onOpenModal } from "../../../redux/features/modalEventSlice";

const TableButtonEvents = ({ row, onClick, onOpenModalUpdate }) => {
  const dispatch = useDispatch();

  const onOpenModalViewEvent = () => dispatch(onOpenModal());

  const handleOnClick = (isCancell = false) => {
    onClick();
    const values = { ...row.values, isCancell };
    dispatch(setEventSelected(values));
  };

  const handleUpdateEvent = () => {
    const { id: event_id } = row.values;
    dispatch(getEvent(event_id));
    dispatch(setIsUpdate(true));
    onOpenModalUpdate();
  };

  const handleViewEvent = () => {
    const { id: event_id } = row.values;
    dispatch(getEvent(event_id));
    onOpenModalViewEvent();
  };

  const { event_state } = row.values;
  return (
    <TableButton>
      <MenuList>
        <MenuItem onClick={handleViewEvent}>Ver evento</MenuItem>

        {event_state !== CANCELADO && event_state !== FINALIZADO && (
          <MenuItem onClick={handleUpdateEvent}>Editar evento</MenuItem>
        )}

        {event_state === PROCESO && event_state !== CANCELADO && (
          <MenuItem onClick={() => handleOnClick(false)}>
            Marcar como en ruta
          </MenuItem>
        )}
        {event_state === EN_RUTA && event_state !== CANCELADO && (
          <MenuItem onClick={() => handleOnClick(false)}>
            Finalizar evento
          </MenuItem>
        )}

        {event_state !== CANCELADO && event_state !== FINALIZADO && (
          <MenuItem onClick={() => handleOnClick(true)}>
            Cancelar evento
          </MenuItem>
        )}
      </MenuList>
    </TableButton>
  );
};

export default TableButtonEvents;

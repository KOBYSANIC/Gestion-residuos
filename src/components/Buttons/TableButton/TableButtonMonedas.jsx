import React from "react";
import TableButton from "./TableButton";
import { useDispatch } from "react-redux";
import {
  getMoneda,
  setMonedaSelected,
  setIsUpdate,
} from "../../../redux/features/monedaSlice";

const TableButtonMoneda = ({ values, onOpenEliminar, onOpenCreateUpdate }) => {
  const dispatch = useDispatch();

  const handleUpdate = () => {
    const { id } = values;
    dispatch(getMoneda(id));
    dispatch(setIsUpdate(true));
    onOpenCreateUpdate();
  };
  const handleOnClick = () => {
    onOpenEliminar();
    dispatch(setMonedaSelected(values));
  };
  const items = [
    {
      name: "Editar conversión",
      onClick: handleUpdate,
      hidden: false,
    },
    {
      name: "Eliminar conversión",
      onClick: handleOnClick,
      hidden: false,
    },
  ];

  return <TableButton items={items}></TableButton>;
};

export default TableButtonMoneda;

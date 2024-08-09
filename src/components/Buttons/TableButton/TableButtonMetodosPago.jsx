import React from "react";

// components
import TableButton from "./TableButton";

// redux
import { useDispatch } from "react-redux";
import {
  getMetodoPago,
  setMetodoPagoSelected,
  setIsUpdate,
} from "../../../redux/features/metodosPagoSlice";

const TableButtonMetodosPago = ({
  values,
  onOpenEliminar,
  onOpenCreateUpdate,
}) => {
  const dispatch = useDispatch();

  const handleUpdate = () => {
    const { id } = values;
    dispatch(getMetodoPago(id));
    dispatch(setIsUpdate(true));
    onOpenCreateUpdate();
  };

  const handleOnClick = () => {
    onOpenEliminar();
    dispatch(setMetodoPagoSelected(values));
  };
  const items = [
    {
      name: "Editar metodo de pago",
      onClick: handleUpdate,
      hidden: false,
    },
    {
      name: "Eliminar metodo de pago",
      onClick: handleOnClick,
      hidden: false,
    },
  ];

  return <TableButton items={items}></TableButton>;
};

export default TableButtonMetodosPago;

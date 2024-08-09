import React from "react";
import TableButton from "./TableButton";

import { useDispatch } from "react-redux";
import {
  getCarrusel,
  setCarruselSelected,
  setIsUpdate,
} from "../../../redux/features/carruselSlice";

const TableButtonCarrusel = ({
  values,
  onOpenEliminar,
  onOpenCreateUpdate,
}) => {
  const dispatch = useDispatch();

  const handleUpdate = () => {
    const { id } = values;
    dispatch(getCarrusel(id));
    dispatch(setIsUpdate(true));
    onOpenCreateUpdate();
  };

  const handleOnClick = () => {
    onOpenEliminar();
    dispatch(setCarruselSelected(values));
  };

  const items = [
    {
      name: "Editar imagen",
      onClick: handleUpdate,
      hidden: false,
    },
    {
      name: "Eliminar imagen",
      onClick: handleOnClick,
      hidden: false,
    },
  ];

  return <TableButton items={items}></TableButton>;
};

export default TableButtonCarrusel;

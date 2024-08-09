import React from "react";
import TableButton from "./TableButton";

import { useDispatch } from "react-redux";
import {
  getPregunta,
  setIsUpdate,
  setPreguntaSelected,
} from "../../../redux/features/preguntaSlice";

const TableButtonPregunta = ({
  values,
  onOpenELiminar,
  onOpenCreateUpdate,
}) => {
  const dispatch = useDispatch();

  const handleUpdate = () => {
    const { id } = values;
    dispatch(getPregunta(id));
    dispatch(setIsUpdate(true));
    onOpenCreateUpdate();
  };

  const handleOnClick = () => {
    onOpenELiminar();
    dispatch(setPreguntaSelected(values));
  };

  const items = [
    {
      name: "Editar pregunta",
      onClick: handleUpdate,
      hidden: false,
    },
    {
      name: "Eliminar pregunta",
      onClick: handleOnClick,
      hidden: false,
    },
  ];

  return <TableButton items={items}></TableButton>;
};

export default TableButtonPregunta;

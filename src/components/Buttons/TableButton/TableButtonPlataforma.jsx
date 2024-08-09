import React from "react";

// components
import TableButton from "./TableButton";

// redux
import { useDispatch } from "react-redux";
import {
  getPlataforma,
  setIsUpdate,
  setPlataformaSelected,
} from "../../../redux/features/plataformaSlice";

const TableButtonPlataforma = ({
  values,
  onOpenEliminar,
  onOpenCreateUpdate,
}) => {
  const dispatch = useDispatch();

  const handleUpdate = () => {
    const { id } = values;
    dispatch(getPlataforma(id));
    dispatch(setIsUpdate(true));
    onOpenCreateUpdate();
  };

  const handleOnClick = () => {
    onOpenEliminar();
    dispatch(setPlataformaSelected(values));
  };
  const items = [
    {
      name: "Editar plataforma",
      onClick: handleUpdate,
      hidden: false,
    },
    {
      name: "Eliminar plataforma",
      onClick: handleOnClick,
      hidden: false,
    },
  ];

  return <TableButton items={items}></TableButton>;
};

export default TableButtonPlataforma;

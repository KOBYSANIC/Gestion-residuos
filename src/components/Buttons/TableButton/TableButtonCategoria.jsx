import React from "react";

// components
import TableButton from "./TableButton";

// redux
import { useDispatch } from "react-redux";
import {
  getCategoria,
  setCategoriaSelected,
  setIsUpdate,
} from "../../../redux/features/categoriaSlice";

const TableButtonCategoria = ({
  values,
  onOpenEliminar,
  onOpenCreateUpdate,
}) => {
  const dispatch = useDispatch();

  const handleUpdate = () => {
    const { id } = values;
    dispatch(getCategoria(id));
    dispatch(setIsUpdate(true));
    onOpenCreateUpdate();
  };

  const handleOnClick = () => {
    onOpenEliminar();
    dispatch(setCategoriaSelected(values));
  };

  const items = [
    {
      name: "Editar categoria",
      onClick: handleUpdate,
      hidden: false,
    },
    {
      name: "Eliminar categoria",
      onClick: handleOnClick,
      hidden: false,
    },
  ];

  return <TableButton items={items}></TableButton>;
};

export default TableButtonCategoria;

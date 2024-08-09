import React from "react";

// components
import TableButton from "./TableButton";

// redux
import { useDispatch } from "react-redux";
import {
  getCodigo,
  setIsUpdate,
  setCodigoSelected,
} from "../../../redux/features/codigoSlice";

const TableButtonCodigo = ({ values, onOpenEliminar, onOpenCreateUpdate }) => {
  const dispatch = useDispatch();

  const handleUpdate = () => {
    const { id } = values;
    dispatch(getCodigo(id));
    dispatch(setIsUpdate(true));
    onOpenCreateUpdate();
  };

  const handleOnClick = () => {
    onOpenEliminar();
    dispatch(setCodigoSelected(values));
  };
  const items = [
    {
      name: "Editar codigo",
      onClick: handleUpdate,
      hidden: false,
    },
    {
      name: "Eliminar codigo",
      onClick: handleOnClick,
      hidden: false,
    },
  ];

  return <TableButton items={items}></TableButton>;
};

export default TableButtonCodigo;

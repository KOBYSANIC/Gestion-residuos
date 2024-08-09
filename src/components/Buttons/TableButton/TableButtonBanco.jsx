import React from "react";

// components
import TableButton from "./TableButton";

// redux
import { useDispatch } from "react-redux";
import {
  getBanco,
  setBancoSelected,
  setIsUpdate,
} from "../../../redux/features/bancoSlice";

const TableButtonBanco = ({ values, onOpenEliminar, onOpenCreateUpdate }) => {
  const dispatch = useDispatch();

  const handleUpdate = () => {
    const { id } = values;
    dispatch(getBanco(id));
    dispatch(setIsUpdate(true));
    onOpenCreateUpdate();
  };

  const handleOnClick = () => {
    onOpenEliminar();
    dispatch(setBancoSelected(values));
  };
  const items = [
    {
      name: "Editar banco",
      onClick: handleUpdate,
      hidden: false,
    },
    {
      name: "Eliminar banco",
      onClick: handleOnClick,
      hidden: false,
    },
  ];

  return <TableButton items={items}></TableButton>;
};

export default TableButtonBanco;

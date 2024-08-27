import React from "react";

// components
import TableButton from "./TableButton";

// redux
import { useDispatch } from "react-redux";
import {
  getMarca,
  setIsUpdate,
  setMarcaSelected,
} from "../../../redux/features/marcaSlice";

const TableButtonMarca = ({ values, onOpenEliminar, onOpenCreateUpdate }) => {
  const dispatch = useDispatch();

  const handleUpdate = () => {
    const { id } = values;
    dispatch(getMarca(id));
    dispatch(setIsUpdate(true));
    onOpenCreateUpdate();
  };

  const handleOnClick = () => {
    onOpenEliminar();
    dispatch(setMarcaSelected(values));
  };
  const items = [
    {
      name: "Editar vehículo",
      onClick: handleUpdate,
      hidden: false,
    },
    {
      name: "Cambiar estado",
      onClick: handleOnClick,
      hidden: false,
    },
  ];

  return <TableButton items={items}></TableButton>;
};

export default TableButtonMarca;

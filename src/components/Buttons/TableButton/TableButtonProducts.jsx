import React from "react";
import TableButton from "./TableButton";

// redux
import { useDispatch } from "react-redux";
import {
  getProducto,
  setIsUpdate,
  setProductoSelected,
} from "../../../redux/features/productoSlice";
import { GENERADO_RESIDUO } from "../../../Utils/constants";

const TableButtonProducts = ({
  values,
  onOpenEliminar,
  onOpenCreateUpdate,
}) => {
  const dispatch = useDispatch();

  const handleUpdate = () => {
    const { id } = values;
    dispatch(getProducto(id));
    dispatch(setIsUpdate(true));
    onOpenCreateUpdate();
  };

  const handleOnClick = () => {
    onOpenEliminar();
    dispatch(setProductoSelected(values));
  };

  const items = [
    {
      name: "Editar residuo",
      onClick: handleUpdate,
      hidden: values.estado !== GENERADO_RESIDUO,
    },
    {
      name: "Eliminar residuo",
      onClick: handleOnClick,
      hidden: false,
    },
  ];

  return <TableButton items={items}></TableButton>;
};

export default TableButtonProducts;

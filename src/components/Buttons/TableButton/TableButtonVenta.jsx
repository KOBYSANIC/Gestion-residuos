import React from "react";
import TableButton from "./TableButton";
import {
  CANCELADO_ORDER,
  COMPLETADO,
  FINALIZADO_RESIDUO,
  GENERADO_ORDER,
  GENERADO_RESIDUO,
  PAGO_CONFIRMADO,
  RECOLECTADO_RESIDUO,
  REEMBOLSO_REALIZADO,
} from "../../../Utils/constants";
import { useDispatch } from "react-redux";
import { getOrder } from "../../../redux/features/ventaSlice";

const TableButtonVenta = ({
  row,
  setVentaID,
  onOpen,
  onOpen2,
  onOpen4,
  onOpen5,
  setIsView,
}) => {
  const dispatch = useDispatch();
  const items = [
    {
      name: "Ver detalles",
      onClick: () => {
        setVentaID(row.values.id);
        setIsView(true);
        dispatch(getOrder(row.values.id));
        onOpen2();
      },
      hidden: row.values.estado === GENERADO_RESIDUO,
    },
    {
      name: "Administrar",
      onClick: () => {
        setVentaID(row.values.id);
        dispatch(getOrder(row.values.id));
        setIsView(false);
        onOpen2();
      },
      hidden: row.values.estado !== GENERADO_RESIDUO,
    },
    {
      name: "Marcar como finalizado",
      onClick: () => {
        onOpen5();
        setVentaID(row.values.id);
      },
      hidden: row.values.estado !== RECOLECTADO_RESIDUO,
    },
    {
      name: "Marcar como no recolectado",
      onClick: () => {
        onOpen4();
        setVentaID(row.values.id);
      },
      hidden: row.values.estado !== GENERADO_RESIDUO,
    },
    {
      name: "Cancelar recolección",
      onClick: () => {
        onOpen();
        setVentaID(row.values.id);
      },
      hidden: row.values.estado !== GENERADO_RESIDUO,
    },
  ];

  return <TableButton items={items}></TableButton>;
};

export default TableButtonVenta;

import React from "react";
import TableButton from "./TableButton";
import {
  CANCELADO_ORDER,
  COMPLETADO,
  GENERADO_ORDER,
  PAGO_CONFIRMADO,
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
      name: "Administrar",
      onClick: () => {
        setVentaID(row.values.id);
        dispatch(getOrder(row.values.id));
        setIsView(false);
        onOpen2();
      },
      hidden:
        row.values.status !== GENERADO_ORDER &&
        row.values.status !== PAGO_CONFIRMADO,
    },
    {
      name: "Marcar como reembolsado",
      onClick: () => {
        onOpen5();
        setVentaID(row.values.id);
      },
      hidden:
        row.values.status === GENERADO_ORDER ||
        row.values.status === PAGO_CONFIRMADO ||
        row.values.status === COMPLETADO ||
        row.values.status === CANCELADO_ORDER ||
        row.values.status === REEMBOLSO_REALIZADO,
    },
    {
      name: "Marcar un error",
      onClick: () => {
        onOpen4();
        setVentaID(row.values.id);
      },
      hidden:
        row.values.status !== GENERADO_ORDER &&
        row.values.status !== PAGO_CONFIRMADO,
    },
    {
      name: "Cancelar venta",
      onClick: () => {
        onOpen();
        setVentaID(row.values.id);
      },
      hidden: row.values.status !== GENERADO_ORDER,
    },
    {
      name: "Ver detalles",
      onClick: () => {
        setVentaID(row.values.id);
        setIsView(true);
        dispatch(getOrder(row.values.id));
        onOpen2();
      },
      hidden:
        row.values.status === GENERADO_ORDER ||
        row.values.status === PAGO_CONFIRMADO,
    },
  ];

  return <TableButton items={items}></TableButton>;
};

export default TableButtonVenta;

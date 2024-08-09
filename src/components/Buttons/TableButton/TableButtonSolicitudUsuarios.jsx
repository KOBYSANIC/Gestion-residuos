import React from "react";
import TableButton from "./TableButton";

const TableButtonSolicitudUsuarios = () => {
  const items = [
    {
      name: "Ver Solicitud",
      onClick: () => {},
      hidden: false,
    },
  ];

  return <TableButton items={items}></TableButton>;
};

export default TableButtonSolicitudUsuarios;

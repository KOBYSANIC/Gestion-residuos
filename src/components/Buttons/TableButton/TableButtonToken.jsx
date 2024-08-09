import React from "react";
import TableButton from "./TableButton";

const TableButtonToken = () => {
  const items = [
    {
      name: "Cancelar venta",
      onClick: () => () => {},
      hidden: false,
    },
  ];

  return <TableButton items={items}></TableButton>;
};

export default TableButtonToken;

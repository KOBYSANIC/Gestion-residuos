import React from "react";
import TableButton from "./TableButton";

import { useDispatch } from "react-redux";
import {
  getUser,
  setIsUpdate,
  setUserSelected,
} from "../../../redux/features/userSlice";

const TableButtonUsers = ({ row, onClick, onOpenModalUpdate, active }) => {
  const dispatch = useDispatch();

  const handleOnClick = (isCancell = false) => {
    onClick();
    const values = { ...row.values, isCancell };
    dispatch(setUserSelected(values));
  };

  const handleUpdateUser = () => {
    const { id: user_id } = row.values;
    dispatch(getUser(user_id));
    dispatch(setIsUpdate(true));
    onOpenModalUpdate();
  };

  const items = [
    {
      name: "Editar usuario",
      onClick: handleUpdateUser,
      hidden: false,
    },
    {
      name: "Inactivar usuario",
      onClick: () => handleOnClick(true),
      hidden: !active,
    },
  ];

  return <TableButton items={items}></TableButton>;
};

export default TableButtonUsers;

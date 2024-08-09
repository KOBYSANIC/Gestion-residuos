import React from "react";
import TableButton from "./TableButton";
import { MenuItem, MenuList } from "@chakra-ui/react";

import { useDispatch } from "react-redux";
import {
  getCategory,
  setIsUpdate,
  setCategorySelected,
} from "../../../redux/features/categorySlice";

const TableButtonCategories = ({ row, onClick, onOpenModalUpdate }) => {
  const dispatch = useDispatch();

  const handleOnClick = (isCancell = false) => {
    onClick();
    const values = { ...row.values, isCancell };
    dispatch(setCategorySelected(values));
  };

  const handleUpdateCategory = () => {
    const { id: category_id } = row.values;
    dispatch(getCategory(category_id));
    dispatch(setIsUpdate(true));
    onOpenModalUpdate();
  };

  return (
    <TableButton>
      <MenuList>
        {/* <MenuItem onClick={handleViewEvent}>Ver evento</MenuItem> */}
        <MenuItem onClick={handleUpdateCategory}>Editar categoria</MenuItem>
        <MenuItem onClick={() => handleOnClick(true)}>
          Eliminar categoria
        </MenuItem>
      </MenuList>
    </TableButton>
  );
};

export default TableButtonCategories;

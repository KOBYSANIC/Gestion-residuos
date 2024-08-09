import React from "react";
import TableButton from "./TableButton";
import { MenuItem, MenuList } from "@chakra-ui/react";

import { useDispatch } from "react-redux";
import {
  getBrand,
  setIsUpdate,
  setBrandSelected,
} from "../../../redux/features/brandSlice";

const TableButtonBrands = ({ row, onClick, onOpenModalUpdate }) => {
  const dispatch = useDispatch();

  const handleOnClick = (isCancell = false) => {
    onClick();
    const values = { ...row.values, isCancell };
    dispatch(setBrandSelected(values));
  };

  const handleUpdateBrand = () => {
    const { id: brand_id } = row.values;
    dispatch(getBrand(brand_id));
    dispatch(setIsUpdate(true));
    onOpenModalUpdate();
  };

  return (
    <TableButton>
      <MenuList>
        {/* <MenuItem onClick={handleViewEvent}>Ver evento</MenuItem> */}
        <MenuItem onClick={handleUpdateBrand}>Editar marca</MenuItem>
        <MenuItem onClick={() => handleOnClick(true)}>Eliminar marca</MenuItem>
      </MenuList>
    </TableButton>
  );
};

export default TableButtonBrands;

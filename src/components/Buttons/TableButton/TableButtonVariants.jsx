import React from "react";
import TableButton from "./TableButton";
import { MenuItem, MenuList } from "@chakra-ui/react";

import { useDispatch } from "react-redux";
import {
  getVariant,
  setIsUpdate,
  setVariantSelected,
} from "../../../redux/features/variantSlice";

const TableButtonVariants = ({ row, onClick, onOpenModalUpdate }) => {
  const dispatch = useDispatch();

  const handleOnClick = (isCancell = false) => {
    onClick();
    const values = { ...row.values, isCancell };
    dispatch(setVariantSelected(values));
  };

  const handleUpdateVariant = () => {
    const { id: variant_id } = row.values;
    dispatch(getVariant(variant_id));
    dispatch(setIsUpdate(true));
    onOpenModalUpdate();
  };

  return (
    <TableButton>
      <MenuList>
        {/* <MenuItem onClick={handleViewEvent}>Ver evento</MenuItem> */}
        <MenuItem onClick={handleUpdateVariant}>Editar variación</MenuItem>
        <MenuItem onClick={() => handleOnClick(true)}>
          Eliminar variación
        </MenuItem>
      </MenuList>
    </TableButton>
  );
};

export default TableButtonVariants;

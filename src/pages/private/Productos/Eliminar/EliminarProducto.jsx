import React from "react";

// components
import ModalAlert from "../../../../components/Modal/ModalAlert";

// redux
import { useDispatch, useSelector } from "react-redux";
import {
  eliminarProducto,
  selectProductoSelected,
} from "../../../../redux/features/productoSlice";

const EliminarProducto = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const productSelected = useSelector(selectProductoSelected);

  const handleOnContinue = () => {
    dispatch(eliminarProducto(productSelected.id));
  };
  return (
    <ModalAlert
      subTitleText={"Estas por eliminar el residuo"}
      description="Al eliminar el resdiuo, ya no podras recuperarlo, "
      emphasisDescription="esta accion no se podrá revertir."
      isOpen={isOpen}
      onClose={onClose}
      onContinue={handleOnContinue}
    />
  );
};

export default EliminarProducto;

import React from "react";

// components
import ModalAlert from "../../../../../components/Modal/ModalAlert";

// redux
import { useDispatch, useSelector } from "react-redux";
import {
  eliminarMetodoPago,
  selectMetodoPagoSelected,
} from "../../../../../redux/features/metodosPagoSlice";

const EliminarMetodoPago = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const metodoPagoSelected = useSelector(selectMetodoPagoSelected);

  const handleOnContinue = () => {
    dispatch(eliminarMetodoPago(metodoPagoSelected.id));
  };

  return (
    <ModalAlert
      subTitleText={`Estas por eliminar el los metodos de pago de ${metodoPagoSelected?.["pais.label"]}.`}
      description="Al eliminar el metodo de pago, ya no podras recuperarlo, "
      emphasisDescription="esta accion no se podrá revertir."
      isOpen={isOpen}
      onClose={onClose}
      onContinue={handleOnContinue}
    />
  );
};

export default EliminarMetodoPago;

import React from "react";

// components
import ModalAlert from "../../../../../components/Modal/ModalAlert";

// redux
import { useDispatch, useSelector } from "react-redux";
import {
  eliminarMoneda,
  selectMonedaSelected,
} from "../../../../../redux/features/monedaSlice";

const EliminarMoneda = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const monedaSelected = useSelector(selectMonedaSelected);

  const handleOnContinue = () => {
    dispatch(eliminarMoneda(monedaSelected.id));
  };
  return (
    <ModalAlert
      subTitleText={`Estas por eliminar la conversión ${monedaSelected?.Nombre}.`}
      description="Al eliminar la conversión, ya no podras recuperarla, "
      emphasisDescription="esta accion no se podrá revertir."
      isOpen={isOpen}
      onClose={onClose}
      onContinue={handleOnContinue}
    />
  );
};

export default EliminarMoneda;

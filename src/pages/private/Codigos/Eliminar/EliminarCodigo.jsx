import React from "react";

// components
import ModalAlert from "../../../../components/Modal/ModalAlert";

// redux
import { useDispatch, useSelector } from "react-redux";
import {
  eliminarCodigo,
  selectCodigoSelected,
} from "../../../../redux/features/codigoSlice";

const EliminarCodigo = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const codigoSelected = useSelector(selectCodigoSelected);

  const handleOnContinue = () => {
    dispatch(eliminarCodigo(codigoSelected.id));
  };
  return (
    <ModalAlert
      subTitleText={`Estas por eliminar el codigo ${codigoSelected?.nombre_codigo}.`}
      description="Al eliminar el codigo, ya no podras recuperarlo, "
      emphasisDescription="esta accion no se podrá revertir."
      isOpen={isOpen}
      onClose={onClose}
      onContinue={handleOnContinue}
    />
  );
};

export default EliminarCodigo;

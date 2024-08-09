import React from "react";

// components
import ModalAlert from "../../../../../components/Modal/ModalAlert";

// redux
import { useDispatch, useSelector } from "react-redux";
import { eliminarBanco, selectBancoSelected } from "../../../../../redux/features/bancoSlice";

const EliminarBanco = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const bancoSelected = useSelector(selectBancoSelected);

  const handleOnContinue = () => {
    dispatch(eliminarBanco(bancoSelected.id));
  };
  return (
    <ModalAlert
      subTitleText={`Estas por eliminar el banco ${bancoSelected?.nombre_banco}.`}
      description="Al eliminar el banco, ya no podras recuperarlo, "
      emphasisDescription="esta accion no se podrá revertir."
      isOpen={isOpen}
      onClose={onClose}
      onContinue={handleOnContinue}
    />
  );
};

export default EliminarBanco;

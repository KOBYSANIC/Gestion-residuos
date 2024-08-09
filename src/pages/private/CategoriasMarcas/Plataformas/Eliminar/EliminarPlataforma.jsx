import React from "react";

// components
import ModalAlert from "../../../../../components/Modal/ModalAlert";

// redux
import { useDispatch, useSelector } from "react-redux";
import {
  eliminarPlataforma,
  selectPlataformaSelected,
} from "../../../../../redux/features/plataformaSlice";

const EliminarPlataforma = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const plataformaSelected = useSelector(selectPlataformaSelected);

  const handleOnContinue = () => {
    dispatch(eliminarPlataforma(plataformaSelected.id));
  };
  return (
    <ModalAlert
      subTitleText={`Estas por eliminar la plataforma ${plataformaSelected?.nombre_plataforma}.`}
      description="Al eliminar la plataforma, ya no podras recuperarlo, "
      emphasisDescription="esta accion no se podrá revertir."
      isOpen={isOpen}
      onClose={onClose}
      onContinue={handleOnContinue}
    />
  );
};

export default EliminarPlataforma;

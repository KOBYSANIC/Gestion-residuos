import React from "react";

// components
import ModalAlert from "../../../../../components/Modal/ModalAlert";

// redux
import { useDispatch, useSelector } from "react-redux";
import { 
  eliminarCarrusel, 
  selectCarruselSelected, 
} from "../../../../../redux/features/carruselSlice";

const EliminarCarrusel = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const carryselSelected = useSelector(selectCarruselSelected);

  const handleOnContinue = () => {
    dispatch(eliminarCarrusel(carryselSelected.id));
  };
  return (
    <ModalAlert
      subTitleText={`Estas por eliminar la imagen ${carryselSelected?.nombre_carrusel}.`}
      description="Al eliminar la imagen, ya no podras recuperarla, "
      emphasisDescription="esta accion no se podrá revertir."
      isOpen={isOpen}
      onClose={onClose}
      onContinue={handleOnContinue}
    />
  );
};

export default EliminarCarrusel;

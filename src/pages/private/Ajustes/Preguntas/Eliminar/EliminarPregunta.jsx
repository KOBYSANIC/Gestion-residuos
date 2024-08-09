import React from "react";

// components
import ModalAlert from "../../../../../components/Modal/ModalAlert";
// redux
import { useDispatch, useSelector } from "react-redux";
import { 
  eliminarPregunta, 
  selectPreguntaSelected 
} from "../../../../../redux/features/preguntaSlice";

const EliminarPregunta = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const preguntaSelected = useSelector(selectPreguntaSelected);

  const handleOnContinue = () => {
    dispatch(eliminarPregunta(preguntaSelected.id));
  };
  return (
    <ModalAlert
      subTitleText={`Estas por eliminar el pregunta ${preguntaSelected?.nombre_pregunta}.`}
      description="Al eliminar la pregunta, ya no podras recuperarla, "
      emphasisDescription="esta accion no se podrá revertir."
      isOpen={isOpen}
      onClose={onClose}
      onContinue={handleOnContinue}
    />
  );
};

export default EliminarPregunta;

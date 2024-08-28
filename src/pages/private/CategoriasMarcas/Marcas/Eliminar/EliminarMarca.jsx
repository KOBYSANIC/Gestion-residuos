import React from "react";

// components
import ModalAlert from "../../../../../components/Modal/ModalAlert";

// redux
import { useDispatch, useSelector } from "react-redux";
import {
  eliminarMarca,
  selectMarcaSelected,
} from "../../../../../redux/features/marcaSlice";

const EliminarMarca = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const marcaSelected = useSelector(selectMarcaSelected);

  const handleOnContinue = () => {
    dispatch(
      eliminarMarca({ id: marcaSelected?.id, stauts: marcaSelected?.active })
    );
  };
  return (
    <ModalAlert
      subTitleText={`Estas por eliminar la marca ${marcaSelected?.nombre_marca}.`}
      description="Al eliminar la marca, ya no podras recuperarlo, "
      emphasisDescription="esta accion no se podrá revertir."
      isOpen={isOpen}
      onClose={onClose}
      onContinue={handleOnContinue}
    />
  );
};

export default EliminarMarca;

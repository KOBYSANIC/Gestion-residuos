import React from "react";

// components
import ModalAlert from "../../../../../components/Modal/ModalAlert";

// redux
import { useDispatch, useSelector } from "react-redux";
import {
  eliminarCategoria,
  selectCategoriaSelected,
} from "../../../../../redux/features/categoriaSlice";

const EliminarCategoria = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const categoriaSelected = useSelector(selectCategoriaSelected);

  const handleOnContinue = () => {
    dispatch(eliminarCategoria(categoriaSelected.id));
  };
  return (
    <ModalAlert
      subTitleText={`Estas por eliminar la ruta ${categoriaSelected?.nombre_categoria}.`}
      description="Al eliminar la ruta, ya no podras recuperarlo, "
      emphasisDescription="esta accion no se podrá revertir."
      isOpen={isOpen}
      onClose={onClose}
      onContinue={handleOnContinue}
    />
  );
};

export default EliminarCategoria;

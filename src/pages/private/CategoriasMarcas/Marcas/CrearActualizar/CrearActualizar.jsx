import React, { useEffect } from "react";

// react-hook-form
import { useForm } from "react-hook-form";

// chakra
import { Skeleton } from "@chakra-ui/react";

// redux
import { useDispatch, useSelector } from "react-redux";

import {
  createMarca,
  loadingActions,
  selectMarcaDataUpdate,
  selectIsUpdate,
  updateMarca,
} from "../../../../../redux/features/marcaSlice";

// components
import ModalForm from "../../../../../components/Modal/ModalForm";
import MarcaForm from "./MarcaForm";

const CrearActualizar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  // selectores de redux
  const marcaSelected = useSelector(selectMarcaDataUpdate);
  const loading = useSelector(loadingActions);
  const isUpdate = useSelector(selectIsUpdate);
  const modalTitle = isUpdate ? "Editar Marca" : "Nueva Marca";
  const buttonTitle = isUpdate ? "Actualizar Marca" : "Agregar Marca";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const loading_save = useSelector(loadingActions);

  const onSubmit = (data) => {
    if (isUpdate) {
      dispatch(updateMarca({ ...data, onClose, reset }));
    } else {
      dispatch(createMarca({ ...data, onClose, reset }));
    }
  };

  useEffect(() => {
    if (isUpdate) {
      reset(marcaSelected);
    } else {
      reset({});
    }
  }, [isUpdate, marcaSelected]);

  return (
    <>
      <ModalForm
        titleModal={modalTitle}
        isOpen={isOpen}
        onClose={onClose}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        textButtonClose="Cancelar"
        textButtonSubmit={buttonTitle}
        loadingButtonSubmit={loading_save}
      >
        {loading && isUpdate ? (
          <>
            <Skeleton
              height="80px"
              boxShadow="card"
              borderRadius="10px"
              startColor="brand.disabled"
              endColor="brand.gray3"
            />
            <Skeleton
              height="80px"
              boxShadow="card"
              borderRadius="10px"
              startColor="brand.disabled"
              endColor="brand.gray3"
            />
          </>
        ) : (
          <MarcaForm errors={errors} register={register} />
        )}
      </ModalForm>
    </>
  );
};

export default CrearActualizar;

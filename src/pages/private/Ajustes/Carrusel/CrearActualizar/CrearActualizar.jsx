import React, { useEffect } from "react";

// react-hook-form
import { useForm } from "react-hook-form";

// chakra
import { Skeleton } from "@chakra-ui/react";

// redux
import { useDispatch, useSelector } from "react-redux";

import {
  createCarrusel,
  loadingActions,
  selectCarruselDataUpdate,
  selectIsUpdate,
  updateCarrusel,
} from "../../../../../redux/features/carruselSlice";

// components
import ModalForm from "../../../../../components/Modal/ModalForm";
import CarruselForm from "./CarruselForm";

const CrearActualizar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  // selectores de redux
  const carruselSelected = useSelector(selectCarruselDataUpdate);
  const loading = useSelector(loadingActions);
  const isUpdate = useSelector(selectIsUpdate);
  const modalTitle = isUpdate ? "Editar Imagen" : "Nueva Imagen";
  const buttonTitle = isUpdate ? "Actualizar Imagen" : "Agregar Imagen";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm();

  const loading_save = useSelector(loadingActions);

  const onSubmit = (data) => {
    if (isUpdate) {
      dispatch(updateCarrusel({ ...data, onClose, reset }));
    } else {
      dispatch(createCarrusel({ ...data, onClose, reset }));
    }
  };

  useEffect(() => {
    if (isUpdate) {
      reset(carruselSelected);
    } else {
      reset({});
    }
  }, [isUpdate, carruselSelected]);

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
          <CarruselForm errors={errors} register={register} control={control}/>
        )}
      </ModalForm>
    </>
  );
};

export default CrearActualizar;

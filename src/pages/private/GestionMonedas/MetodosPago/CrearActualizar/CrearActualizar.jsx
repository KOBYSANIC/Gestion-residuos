import React, { useEffect } from "react";

// react-hook-form
import { useForm } from "react-hook-form";

// chakra
import { Skeleton } from "@chakra-ui/react";

// redux
import { useDispatch, useSelector } from "react-redux";

import {
  createMetodoPago,
  loadingActions,
  selectMetodosPagoDataUpdate,
  selectIsUpdate,
  updateMetodoPago,
} from "../../../../../redux/features/metodosPagoSlice";

// components
import ModalForm from "../../../../../components/Modal/ModalForm";
import MetodosPagoForm from "./MetodosPagoForm";

const CrearActualizar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  // selectores de redux
  const metodoPagoSelected = useSelector(selectMetodosPagoDataUpdate);
  const loading = useSelector(loadingActions);
  const isUpdate = useSelector(selectIsUpdate);
  const modalTitle = isUpdate
    ? "Editar Método de Pago"
    : "Nuevo Método de Pago";
  const buttonTitle = isUpdate
    ? "Actualizar Método de Pago"
    : "Agregar Método de Pago";

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
      dispatch(updateMetodoPago({ ...data, onClose, reset }));
    } else {
      dispatch(createMetodoPago({ ...data, onClose, reset }));
    }
  };

  useEffect(() => {
    if (isUpdate) {
      reset(metodoPagoSelected);
    } else {
      reset({});
    }
  }, [isUpdate, metodoPagoSelected]);

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
        isCentered={false}
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
          <MetodosPagoForm
            errors={errors}
            register={register}
            control={control}
          />
        )}
      </ModalForm>
    </>
  );
};

export default CrearActualizar;

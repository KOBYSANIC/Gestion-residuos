import React, { useEffect } from "react";

// react-hook-form
import { useForm } from "react-hook-form";

// chakra
import { Skeleton } from "@chakra-ui/react";

// redux
import { useDispatch, useSelector } from "react-redux";

// components
import ModalForm from "../../../../../components/Modal/ModalForm";
import MonedaForm from "./MonedaForm";
import {
  createMoneda,
  loadingActions,
  selectIsUpdate,
  selectMonedaDataUpdate,
  updateMoneda,
} from "../../../../../redux/features/monedaSlice";

const CrearActualizar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  // selectores de redux
  const monedaSelected = useSelector(selectMonedaDataUpdate);
  const loading = useSelector(loadingActions);
  const isUpdate = useSelector(selectIsUpdate);
  const modalTitle = isUpdate ? "Editar Conversión" : "Nueva Conversión";
  const buttonTitle = isUpdate ? "Actualizar Conversión" : "Agregar Conversión";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm();

  const loading_save = useSelector(loadingActions);

  const onSubmit = (data) => {
    const floatValue = parseFloat(data.conversion);
    if (!isNaN(floatValue)) {
      data.conversion = floatValue.toFixed(3);
    }
    if (isUpdate) {
      dispatch(updateMoneda({ ...data, onClose, reset }));
    } else {
      dispatch(createMoneda({ ...data, onClose, reset }));
    }
  };

  setValue("dolar", "1.000");

  useEffect(() => {
    if (isUpdate) {
      reset(monedaSelected);
    } else {
      reset({});
    }
  }, [isUpdate, monedaSelected]);

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
          <MonedaForm
            errors={errors}
            register={register}
            monedaSelected={monedaSelected}
            control={control}
            isUpdate={isUpdate}
          />
        )}
      </ModalForm>
    </>
  );
};

export default CrearActualizar;

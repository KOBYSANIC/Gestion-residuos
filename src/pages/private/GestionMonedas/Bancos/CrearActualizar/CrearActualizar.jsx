import React, { useEffect } from "react";

// react-hook-form
import { useForm } from "react-hook-form";

// chakra
import { Skeleton } from "@chakra-ui/react";

// redux
import { useDispatch, useSelector } from "react-redux";

import {
  createBanco,
  loadingActions,
  selectBancoDataUpdate,
  selectIsUpdate,
  updateBanco,
} from "../../../../../redux/features/bancoSlice";

// components
import ModalForm from "../../../../../components/Modal/ModalForm";
import BancoForm from "./BancoForm";

const CrearActualizar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  // selectores de redux
  const bancoSelected = useSelector(selectBancoDataUpdate);
  const loading = useSelector(loadingActions);
  const isUpdate = useSelector(selectIsUpdate);
  const modalTitle = isUpdate ? "Editar Banco" : "Nuevo Banco";
  const buttonTitle = isUpdate ? "Actualizar Banco" : "Agregar Banco";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm();

  const loading_save = useSelector(loadingActions);

  const onSubmit = (data) => {
    if (isUpdate) {
      dispatch(updateBanco({ ...data, onClose, reset }));
    } else {
      dispatch(createBanco({ ...data, onClose, reset }));
    }
  };

  useEffect(() => {
    if (isUpdate) {
      reset(bancoSelected);
    } else {
      reset({});
    }
  }, [isUpdate, bancoSelected]);

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
          <BancoForm errors={errors} register={register} control={control} valorInput={watch("tipo_banco")}/>
        )}
      </ModalForm>
    </>
  );
};

export default CrearActualizar;

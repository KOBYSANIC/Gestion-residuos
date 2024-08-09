import React, { useEffect } from "react";

// react-hook-form
import { useForm } from "react-hook-form";

// chakra
import { Skeleton } from "@chakra-ui/react";

// redux
import { useDispatch, useSelector } from "react-redux";
import {
  createCodigo,
  loadingActions,
  selectCodigoDataUpdate,
  selectIsUpdate,
  updateCodigo,
} from "../../../../redux/features/codigoSlice";

// components
import ModalForm from "../../../../components/Modal/ModalForm";
import CodigoForm from "./CodigoForm";

const CrearActualizar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  // selectores de redux
  const codigoSelected = useSelector(selectCodigoDataUpdate);
  const loading = useSelector(loadingActions);
  const isUpdate = useSelector(selectIsUpdate);
  const modalTitle = isUpdate ? "Editar Código" : "Nuevo Código";
  const buttonTitle = isUpdate ? "Actualizar Código" : "Agregar Código";

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
      dispatch(updateCodigo({ ...data, onClose, reset }));
    } else {
      dispatch(createCodigo({ ...data, onClose, reset }));
    }
  };

  useEffect(() => {
    if (isUpdate) {
      reset(codigoSelected);
    } else {
      reset({});
    }
  }, [isUpdate, codigoSelected]);

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
          <CodigoForm errors={errors} register={register} control={control} />
        )}
      </ModalForm>
    </>
  );
};

export default CrearActualizar;

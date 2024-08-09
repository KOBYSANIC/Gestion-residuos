import React, { useEffect } from "react";

// react-hook-form
import { useForm } from "react-hook-form";

// chakra
import { Skeleton } from "@chakra-ui/react";

// redux
import { useDispatch, useSelector } from "react-redux";

import {
  createPlataforma,
  loadingActions,
  selectPlataformaDataUpdate,
  selectIsUpdate,
  updatePlataforma,
} from "../../../../../redux/features/plataformaSlice";

// components
import ModalForm from "../../../../../components/Modal/ModalForm";
import PlataformaForm from "./PlataformaForm";

const CrearActualizar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  // selectores de redux
  const plataformaSelected = useSelector(selectPlataformaDataUpdate);
  const loading = useSelector(loadingActions);
  const isUpdate = useSelector(selectIsUpdate);
  const modalTitle = isUpdate ? "Editar Plataforma" : "Nueva Plataforma";
  const buttonTitle = isUpdate ? "Actualizar Plataforma" : "Agregar Plataforma";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const loading_save = useSelector(loadingActions);

  const onSubmit = (data) => {
    if (isUpdate) {
      dispatch(updatePlataforma({ ...data, onClose, reset }));
    } else {
      dispatch(createPlataforma({ ...data, onClose, reset }));
    }
  };

  useEffect(() => {
    if (isUpdate) {
      reset(plataformaSelected);
    } else {
      reset({});
    }
  }, [isUpdate, plataformaSelected]);

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
          <PlataformaForm errors={errors} register={register} />
        )}
      </ModalForm>
    </>
  );
};

export default CrearActualizar;

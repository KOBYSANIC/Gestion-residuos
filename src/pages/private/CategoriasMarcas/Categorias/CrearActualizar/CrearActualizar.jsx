import React, { useEffect } from "react";

// react-hook-form
import { useForm } from "react-hook-form";

// chakra
import { Skeleton } from "@chakra-ui/react";

// redux
import { useDispatch, useSelector } from "react-redux";

import {
  createCategoria,
  loadingActions,
  selectIsUpdate,
  selectCategoriaDataUpdate,
  updateCategoria,
} from "../../../../../redux/features/categoriaSlice";

// components
import ModalForm from "../../../../../components/Modal/ModalForm";
import CategoriaForm from "./CategoriaForm";

const CrearActualizar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  // selectores de redux
  const categoriaSelected = useSelector(selectCategoriaDataUpdate);
  const loading = useSelector(loadingActions);
  const isUpdate = useSelector(selectIsUpdate);
  const modalTitle = isUpdate ? "Editar Ruta" : "Nueva Ruta";
  const buttonTitle = isUpdate ? "Actualizar Ruta" : "Agregar Ruta";

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
      dispatch(updateCategoria({ ...data, onClose, reset }));
    } else {
      dispatch(createCategoria({ ...data, onClose, reset }));
    }
  };

  useEffect(() => {
    if (isUpdate) {
      reset(categoriaSelected);
    } else {
      reset({});
    }
  }, [isUpdate, categoriaSelected]);

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
          <CategoriaForm
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

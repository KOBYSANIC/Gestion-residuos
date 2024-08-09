import React, { useEffect } from "react";

// react-hook-form
import { useForm } from "react-hook-form";

// redux
import { useDispatch, useSelector } from "react-redux";
import {
  createProducto,
  loadingActions,
  selectIsUpdate,
  selectProductoDataUpdate,
  updateProducto,
} from "../../../../redux/features/productoSlice";

// components
import DatosCompraForm from "./DatosCompraForm";
import ModalForm from "../../../../components/Modal/ModalForm";
import { Skeleton } from "@chakra-ui/react";

const CrearActualizar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  // selectores de redux
  const productoSelected = useSelector(selectProductoDataUpdate);
  const loading = useSelector(loadingActions);
  const isUpdate = useSelector(selectIsUpdate);
  const modalTitle = isUpdate ? "Editar Residuo" : "Nuevo Residuo";
  const buttonTitle = isUpdate ? "Actualizar Residuo" : "Nuevo Residuo";

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
      dispatch(updateProducto({ ...data, onClose, reset }));
    } else {
      dispatch(createProducto({ ...data, onClose, reset }));
    }
  };

  useEffect(() => {
    if (isUpdate) {
      reset(productoSelected);
    } else {
      reset({});
    }
  }, [isUpdate, productoSelected]);

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
          <DatosCompraForm
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

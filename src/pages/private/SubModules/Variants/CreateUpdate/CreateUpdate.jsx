import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useDispatch, useSelector } from "react-redux";

import ModalForm from "../../../../../components/Modal/ModalForm";
import VariantsForm from "./VariantsForm";
import { Skeleton } from "@chakra-ui/react";
import {
  createVariant,
  selectIsUpdate,
  selectLoadingSaveVariant,
  selectLoadingupdateVariant,
  selectVariantDataUpdate,
  updateVariant,
} from "../../../../../redux/features/variantSlice";

const CreateUpdate = ({ isOpen, onClose }) => {
  const variantSelected = useSelector(selectVariantDataUpdate);
  const loading = useSelector(selectLoadingupdateVariant);
  const isUpdate = useSelector(selectIsUpdate);
  const dispatch = useDispatch();
  const modalTitle = isUpdate ? "Editar variación" : "Nueva variación";
  const buttonTitle = isUpdate ? "Actualizar variación" : "Agregar variación";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const loading_save = useSelector(selectLoadingSaveVariant);

  const onSubmit = (data) => {
    if (isUpdate) {
      dispatch(updateVariant({ ...data, onClose, reset }));
    } else {
      dispatch(createVariant({ ...data, onClose, reset }));
    }
  };

  useEffect(() => {
    if (isUpdate) {
      reset(variantSelected);
    } else {
      reset({});
    }
  }, [isUpdate, variantSelected]);

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
        {loading ? (
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
            <Skeleton
              height="80px"
              boxShadow="card"
              borderRadius="10px"
              startColor="brand.disabled"
              endColor="brand.gray3"
            />
          </>
        ) : (
          <VariantsForm errors={errors} register={register} />
        )}
      </ModalForm>
    </>
  );
};

export default CreateUpdate;

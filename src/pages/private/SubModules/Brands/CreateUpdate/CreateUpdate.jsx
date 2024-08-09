import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useDispatch, useSelector } from "react-redux";

import ModalForm from "../../../../../components/Modal/ModalForm";
import BrandsForm from "./BrandsForm";
import { Skeleton } from "@chakra-ui/react";
import {
  createBrand,
  selectIsUpdate,
  selectLoadingSaveBrand,
  selectLoadingupdateBrand,
  selectBrandDataUpdate,
  updateBrand,
} from "../../../../../redux/features/brandSlice";

const CreateUpdate = ({ isOpen, onClose }) => {
  const brandSelected = useSelector(selectBrandDataUpdate);
  const loading = useSelector(selectLoadingupdateBrand);
  const isUpdate = useSelector(selectIsUpdate);
  const dispatch = useDispatch();
  const modalTitle = isUpdate ? "Editar marca" : "Nueva marca";
  const buttonTitle = isUpdate ? "Actualizar marca" : "Agregar marca";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const loading_save = useSelector(selectLoadingSaveBrand);

  const onSubmit = (data) => {
    if (isUpdate) {
      dispatch(updateBrand({ ...data, onClose, reset }));
    } else {
      dispatch(createBrand({ ...data, onClose, reset }));
    }
  };

  useEffect(() => {
    if (isUpdate) {
      reset(brandSelected);
    } else {
      reset({});
    }
  }, [isUpdate, brandSelected]);

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
          </>
        ) : (
          <BrandsForm errors={errors} register={register} />
        )}
      </ModalForm>
    </>
  );
};

export default CreateUpdate;

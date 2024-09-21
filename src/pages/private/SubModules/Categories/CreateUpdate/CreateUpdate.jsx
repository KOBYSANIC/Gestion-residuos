import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useDispatch, useSelector } from "react-redux";

import ModalForm from "../../../../../components/Modal/ModalForm";
import CategoriesForm from "./CategoriesForm";
import { Skeleton } from "@chakra-ui/react";
import {
  createCategory,
  selectIsUpdate,
  selectLoadingSaveCategory,
  selectLoadingupdateCategory,
  selectCategoryDataUpdate,
  updateCategory,
} from "../../../../../redux/features/categorySlice";

const CreateUpdate = ({ isOpen, onClose }) => {
  const [showInEcomerce, setShowInEcomerce] = useState(0);

  const categorySelected = useSelector(selectCategoryDataUpdate);
  const loading = useSelector(selectLoadingupdateCategory);
  const isUpdate = useSelector(selectIsUpdate);
  const dispatch = useDispatch();
  const modalTitle = isUpdate ? "Editar categoria" : "";
  const buttonTitle = isUpdate ? "Actualizar categoria" : "Agregar categoria";

  const {
    getValues,
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const loading_save = useSelector(selectLoadingSaveCategory);

  const onSubmit = (data) => {
    if (isUpdate) {
      dispatch(updateCategory({ ...data, onClose, reset }));
    } else {
      dispatch(createCategory({ ...data, onClose, reset }));
    }
  };

  useEffect(() => {
    if (isUpdate) {
      reset(categorySelected);
    } else {
      reset({});
    }
  }, [isUpdate, categorySelected]);

  useEffect(() => {
    const values = getValues();

    if (values.show_in_ecommerce !== undefined) {
      const valueShowInEcomerce = !values.show_in_ecommerce ? 1 : 0;
      setShowInEcomerce(valueShowInEcomerce);
    }
  }, [categorySelected]);

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
          <CategoriesForm
            errors={errors}
            register={register}
            control={control}
            showInEcomerce={showInEcomerce}
            isUpdate={isUpdate}
          />
        )}
      </ModalForm>
    </>
  );
};

export default CreateUpdate;

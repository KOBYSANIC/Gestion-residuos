import React, { useEffect, useState } from "react";
import ModalForm from "../../../../components/Modal/ModalForm";
import { useForm } from "react-hook-form";
import {
  selectLoadingupdateProduct,
  selectProductDataUpdate,
  updateDiscountProduct,
} from "../../../../redux/features/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "@chakra-ui/react";
import FormDiscount from "./FormDiscount";

const Discount = ({ isOpen, onClose }) => {
  const [discounted, setDiscounted] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm();

  const dispatch = useDispatch();

  const loading = useSelector(selectLoadingupdateProduct);

  const onSubmit = (data) => {
    dispatch(updateDiscountProduct(data));
    onClose();
  };

  const productSelected = useSelector(selectProductDataUpdate);

  useEffect(() => {
    reset(productSelected);
    setDiscounted(productSelected?.discounted);
    return () => {
      reset();
    };
  }, [productSelected]);

  return (
    <>
      <ModalForm
        titleModal={"Agregar descuento"}
        isOpen={isOpen}
        onClose={onClose}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        textButtonClose="Cancelar"
        textButtonSubmit={"Guardar"}
        loadingButtonSubmit={loading}
        isCentered={false}
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
            <Skeleton
              height="80px"
              boxShadow="card"
              borderRadius="10px"
              startColor="brand.disabled"
              endColor="brand.gray3"
            />
          </>
        ) : (
          <FormDiscount
            errors={errors}
            register={register}
            control={control}
            discounted={discounted}
            setValue={setValue}
            productSelected={productSelected}
            discounted_from={getValues("discounted_from")}
            discounted_until={getValues("discounted_until")}
          />
        )}
      </ModalForm>
    </>
  );
};

export default Discount;

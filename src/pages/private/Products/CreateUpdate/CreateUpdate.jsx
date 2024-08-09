import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useDispatch, useSelector } from "react-redux";

import ModalForm from "../../../../components/Modal/ModalForm";
import ProductsForm from "./ProductsForm";
import { Skeleton } from "@chakra-ui/react";
import {
  createProduct,
  selectIsUpdate,
  selectLoadingSaveProduct,
  selectLoadingupdateProduct,
  selectProductDataUpdate,
  updateProduct,
} from "../../../../redux/features/productSlice";

const CreateUpdate = ({ isOpen, onClose }) => {
  const [showInEcomerce, setShowInEcomerce] = useState(0);
  const [images, setImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const productSelected = useSelector(selectProductDataUpdate);
  const loading = useSelector(selectLoadingupdateProduct);
  const isUpdate = useSelector(selectIsUpdate);
  const dispatch = useDispatch();
  const modalTitle = isUpdate ? "Editar producto" : "Nuevo producto";
  const buttonTitle = isUpdate ? "Actualizar producto" : "Agregar producto";

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const loading_save = useSelector(selectLoadingSaveProduct);

  const onSubmit = (data) => {
    if (isUpdate) {
      dispatch(
        updateProduct({
          ...data,
          price: {
            currency: "QTZ",
            value: data.price,
            discounted_value: productSelected.discounted_value,
            discount_percentage: productSelected.discount_percentage,
            discounted: productSelected.discounted,
            discounted_until: productSelected.discounted_until || null,
            discounted_from: productSelected.discounted_from || null,
            price_discounted: productSelected.price_discounted || 0,
          },
          images,
          imagesToDelete,
          setImages,
          setImagesToDelete,
          onClose,
          reset,
        })
      );
    } else {
      dispatch(
        createProduct({
          ...data,
          images,
          imagesToDelete,
          setImages,
          setImagesToDelete,
          onClose,
          reset,
        })
      );
    }
  };

  useEffect(() => {
    if (isUpdate) {
      reset(productSelected);
    } else {
      reset({});
    }
  }, [isUpdate, productSelected]);

  useEffect(() => {
    if (productSelected && productSelected.show_in_ecommerce !== undefined) {
      const valueShowInEcomerce = !productSelected.show_in_ecommerce ? 1 : 0;
      setShowInEcomerce(valueShowInEcomerce);
    }

    if (
      productSelected &&
      productSelected.images !== undefined &&
      productSelected.images.length > 0 &&
      isUpdate
    ) {
      setImages(productSelected.images);
    }
  }, [productSelected, isUpdate]);

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
          <ProductsForm
            errors={errors}
            register={register}
            control={control}
            showInEcomerce={showInEcomerce}
            isUpdate={isUpdate}
            tags={productSelected?.tags}
            images={images}
            imagesToDelete={imagesToDelete}
            setImages={setImages}
            setImagesToDelete={setImagesToDelete}
          />
        )}
      </ModalForm>
    </>
  );
};

export default CreateUpdate;

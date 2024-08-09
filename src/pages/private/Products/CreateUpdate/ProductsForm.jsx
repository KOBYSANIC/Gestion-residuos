import React from "react";

import InputFormValidation from "../../../../components/Inputs/InputFormValidation/InputFormValidation";
import InputTextArea from "../../../../components/Inputs/InputTextArea";
import InputSelect from "../../../../components/Inputs/InputSelect";
import { show_in_ecomerce } from "../../../../Utils/constants";
import { TitleIcon } from "../../../../Utils/icons";
import InputMultiSelect from "../../../../components/Inputs/InputSelect/InputMultiSelect";
import InputAsyncSelect from "../../../../components/Inputs/InputSelect/InputAsyncSelect";
import InputUploadFile from "../../../../components/Inputs/InputUploadFile";
import InputJodit from "../../../../components/Inputs/InputJodit/InputJodit";

const ProductsForm = ({
  tags,
  showInEcomerce,
  errors,
  register,
  control,
  isUpdate,
  images,
  imagesToDelete,
  setImages,
  setImagesToDelete,
}) => {
  return (
    <>
      <InputFormValidation
        Icon={TitleIcon}
        placeholder="Ingresa el nombre del producto"
        errors={errors}
        register={register}
        key_name="product_name"
        label="Escribe el nombre del producto"
      />

      <InputFormValidation
        Icon={TitleIcon}
        placeholder="Ingresa el código del producto"
        errors={errors}
        register={register}
        key_name="product_code"
        label="Escribe el código del producto"
      />

      <InputJodit
        Icon={TitleIcon}
        placeholder="Ingresa la descripcion del producto"
        errors={errors}
        control={control}
        register={register}
        key_name="description"
        label="Escribe la descripcion del producto"
      />

      <InputUploadFile
        Icon={TitleIcon}
        placeholder="Ingresa la imagen del producto"
        errors={errors}
        register={register}
        key_name="images2"
        label="Sube la imagen del producto"
        isUpdate={isUpdate}
        images={images}
        imagesToDelete={imagesToDelete}
        setImages={setImages}
        setImagesToDelete={setImagesToDelete}
      />

      <InputSelect
        options={show_in_ecomerce}
        defaultValue={isUpdate}
        defaultOptionValue={showInEcomerce}
        placeholder="Selecciona una opción"
        errors={errors}
        register={register}
        control={control}
        key_name="show_in_ecommerce"
        label="Mostrar en la tienda"
        defaultValueFirts
      />

      <InputFormValidation
        Icon={TitleIcon}
        placeholder="Ingresa el precio del producto"
        errors={errors}
        register={register}
        key_name="price"
        label="Escribe el precio del producto"
        type="number"
        validation={false}
        step="any"
        noScroll
      />

      <InputMultiSelect
        placeholder="Ingresa los tags del producto"
        errors={errors}
        control={control}
        key_name="tags"
        label="Escribe los tags del producto"
        isUpdate={isUpdate}
        defaultValue={tags}
        validation
      />

      <InputAsyncSelect
        placeholder="Selecciona una opción"
        errors={errors}
        control={control}
        key_name="id_categories"
        label="Selecciona la categoria del producto"
        validation
        valueKey="id"
        labelKey="category_name"
        collection_name="categories"
        search_field_name="category_name"
      />

      <InputAsyncSelect
        placeholder="Selecciona una opción"
        errors={errors}
        control={control}
        key_name="id_brands"
        label="Selecciona la marca del producto"
        validation
        valueKey="id"
        labelKey="brand_name"
        collection_name="brands"
        search_field_name="brand_name"
      />

      <InputAsyncSelect
        placeholder="Selecciona una opción"
        errors={errors}
        control={control}
        key_name="id_variants"
        label="Selecciona la variante del producto"
        validation
        valueKey="id"
        labelKey="variant_name"
        collection_name="variants"
        search_field_name="variant_name"
      />

      <InputJodit
        Icon={TitleIcon}
        placeholder="Ingresa las carateristicas del producto"
        errors={errors}
        control={control}
        register={register}
        key_name="characteristics"
        label="Escribe las carateristicas del producto"
      />
    </>
  );
};

export default ProductsForm;

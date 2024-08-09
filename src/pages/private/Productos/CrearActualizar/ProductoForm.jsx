import React from "react";

// icons
import { faFileLines } from "@fortawesome/free-solid-svg-icons";

// constants
import { product_status } from "../../../../Utils/constants";

// components
import InputFormValidation from "../../../../components/Inputs/InputFormValidation/InputFormValidation";
import InputJodit from "../../../../components/Inputs/InputJodit/InputJodit";
import InputSelect from "../../../../components/Inputs/InputSelect";
import InputAsyncSelect from "../../../../components/Inputs/InputSelect/InputAsyncSelect";
import InputMultiSelect from "../../../../components/Inputs/InputSelect/InputMultiSelect";
import InputUploadFile from "../../../../components/Inputs/InputUploadFile";

const ProductoForm = ({ errors, register, control }) => {
  return (
    <>
      <InputFormValidation
        Icon={faFileLines}
        placeholder="Ingresa el nombre del producto"
        errors={errors}
        register={register}
        key_name="nombre_producto"
        label="Escribe el nombre del producto"
      />
      <InputSelect
        options={product_status}
        placeholder="Selecciona la opción de mostrar en la tienda"
        errors={errors}
        register={register}
        control={control}
        key_name="mostrar_en_tienda"
        label="¿Deseas mostrar el producto en la tienda?"
        validation
      />
      <InputJodit
        placeholder="Ingresa la descripcion del producto"
        errors={errors}
        control={control}
        register={register}
        key_name="description"
        label="Escribe la descripcion del producto"
        validation
      />
      <InputJodit
        placeholder="Ingrese la información de recarga"
        errors={errors}
        control={control}
        register={register}
        key_name="instrucciones_recarga"
        label="Información de recarga"
      />
      <InputUploadFile
        errors={errors}
        register={register}
        key_name="imagen_miniatura"
        label="Sube la imagen miniatura del producto"
        control={control}
        validation
      />
      <InputUploadFile
        errors={errors}
        register={register}
        key_name="imagen_portada"
        label="Sube la imagen de portada del producto"
        control={control}
        validation
      />
      <InputAsyncSelect
        placeholder="Selecciona una opción"
        errors={errors}
        control={control}
        key_name="categoria"
        label="Selecciona la categoria del producto"
        validation
        valueKey="id"
        labelKey="nombre_categoria"
        collection_name="categorias"
        search_field_name="buscar_nombre"
      />

      <InputAsyncSelect
        placeholder="Selecciona una opción"
        errors={errors}
        control={control}
        key_name="marca"
        label="Selecciona la marca del producto"
        validation
        valueKey="id"
        labelKey="nombre_marca"
        collection_name="marcas"
        search_field_name="buscar_nombre"
      />
      <InputAsyncSelect
        placeholder="Selecciona una opción"
        errors={errors}
        control={control}
        key_name="plataforma"
        label="Selecciona la plataforma del producto"
        validation
        valueKey="id"
        labelKey="nombre_plataforma"
        collection_name="plataformas"
        search_field_name="buscar_nombre"
      />
      <InputMultiSelect
        placeholder="Ingresa los tags del producto"
        errors={errors}
        control={control}
        key_name="tags"
        label="Escribe los tags del producto"
      />
    </>
  );
};

export default ProductoForm;

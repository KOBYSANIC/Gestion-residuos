import React from "react";

// icons
import { faFileLines } from "@fortawesome/free-solid-svg-icons";

// components
import InputFormValidation from "../../../../../components/Inputs/InputFormValidation/InputFormValidation";
import InputUploadFile from "../../../../../components/Inputs/InputUploadFile";

const CarruselForm = ({ errors, register, control }) => {
  return (
    <>
      <InputFormValidation
        Icon={faFileLines}
        placeholder="Ingresa el nombre de la imagen"
        errors={errors}
        register={register}
        key_name="nombre_carrusel"
        label="Escribe el nombre de la imagen"
      />
      <InputUploadFile
        errors={errors}
        register={register}
        control={control}
        key_name="imagen_carrusel"
        label="Sube la imagen del carrusel"
        validation>
        </InputUploadFile>
    </>
  );
};

export default CarruselForm;

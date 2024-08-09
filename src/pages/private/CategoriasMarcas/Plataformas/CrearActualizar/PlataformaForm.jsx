import React from "react";

// icons
import { faFileLines } from "@fortawesome/free-solid-svg-icons";

// components
import InputFormValidation from "../../../../../components/Inputs/InputFormValidation/InputFormValidation";

const PlataformaForm = ({ errors, register }) => {
  return (
    <>
      <InputFormValidation
        Icon={faFileLines}
        placeholder="Ej: Steam, Epic"
        errors={errors}
        register={register}
        key_name="nombre_plataforma"
        label="Escribe el nombre de la plataforma"
      />

      <InputFormValidation
        Icon={faFileLines}
        placeholder="Ingresa la descripción de la plataforma"
        errors={errors}
        register={register}
        key_name="descripcion_plataforma"
        label="Escribe la descripción de la plataforma"
      />
    </>
  );
};

export default PlataformaForm;

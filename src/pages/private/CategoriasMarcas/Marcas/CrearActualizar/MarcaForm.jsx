import React from "react";

// icons
import { faFileLines } from "@fortawesome/free-solid-svg-icons";

// components
import InputFormValidation from "../../../../../components/Inputs/InputFormValidation/InputFormValidation";

const MarcaForm = ({ errors, register }) => {
  return (
    <>
      <InputFormValidation
        Icon={faFileLines}
        placeholder="Ej: Supercell, Riot Games"
        errors={errors}
        register={register}
        key_name="nombre_marca"
        label="Escribe el nombre de la marca"
      />

      <InputFormValidation
        Icon={faFileLines}
        placeholder="Ingresa la descripción de la marca"
        errors={errors}
        register={register}
        key_name="descripcion_marca"
        label="Escribe la descripción de la marca"
      />
    </>
  );
};

export default MarcaForm;

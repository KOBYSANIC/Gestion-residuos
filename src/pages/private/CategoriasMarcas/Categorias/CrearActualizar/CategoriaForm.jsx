import React from "react";

// icons
import { faFileLines } from "@fortawesome/free-solid-svg-icons";

// components
import InputFormValidation from "../../../../../components/Inputs/InputFormValidation/InputFormValidation";

const CategoriaForm = ({ errors, register }) => {
  return (
    <>
      <InputFormValidation
        Icon={faFileLines}
        placeholder="Ej: Juegos Moviles, Juegos de PC"
        errors={errors}
        register={register}
        key_name="nombre_categoria"
        label="Escribe el nombre de la categoría"
      />

      <InputFormValidation
        Icon={faFileLines}
        placeholder="Ingresa la descripción de la categoría"
        errors={errors}
        register={register}
        key_name="descripcion_categoria"
        label="Escribe la descripción de la categoría"
      />
    </>
  );
};

export default CategoriaForm;

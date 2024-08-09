import React from "react";

// icons
import { faFileLines, faQuestion } from "@fortawesome/free-solid-svg-icons";

// components
import InputFormValidation from "../../../../../components/Inputs/InputFormValidation/InputFormValidation";

const PreguntaForm = ({ errors, register }) => {
  return (
    <>
      <InputFormValidation
        Icon={faQuestion}
        placeholder="¿Cómo funciona nuestro sistema de reembolso?"
        errors={errors}
        register={register}
        key_name="nombre_pregunta"
        label="Ingresa el nombre de la pregunta"
      />
      <InputFormValidation
        Icon={faFileLines}
        placeholder="Para lograr un reembolso se necesita..."
        errors={errors}
        register={register}
        key_name="respuesta_pregunta"
        label="Escribe tu respuesta aqui"
      />
    </>
  );
};

export default PreguntaForm;

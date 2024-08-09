import React from "react";

import InputFormValidation from "../../../../../components/Inputs/InputFormValidation/InputFormValidation";
import { TitleIcon } from "../../../../../Utils/icons";

const VariantsForm = ({ errors, register }) => {
  return (
    <>
      <InputFormValidation
        Icon={TitleIcon}
        placeholder="Ingresa el nombre de la variación"
        errors={errors}
        register={register}
        key_name="variant_name"
        label="Escribe el nombre de la variación"
      />

      <InputFormValidation
        Icon={TitleIcon}
        placeholder="Ingresa el titulo de la variación"
        errors={errors}
        register={register}
        key_name="title"
        label="Escribe el titulo de la variación"
      />

      <InputFormValidation
        Icon={TitleIcon}
        placeholder="Ingresa la descripción de la variación"
        errors={errors}
        register={register}
        key_name="description"
        label="Escribe la descripción de la variación"
      />
    </>
  );
};

export default VariantsForm;

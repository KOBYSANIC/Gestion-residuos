import React from "react";

import InputFormValidation from "../../../../../components/Inputs/InputFormValidation/InputFormValidation";
import { TitleIcon } from "../../../../../Utils/icons";

const BrandsForm = ({ errors, register }) => {
  return (
    <>
      <InputFormValidation
        Icon={TitleIcon}
        placeholder="Ingresa el nombre de la marca"
        errors={errors}
        register={register}
        key_name="brand_name"
        label="Escribe el nombre de la marca"
      />

      <InputFormValidation
        Icon={TitleIcon}
        placeholder="Ingresa la descripción de la marca"
        errors={errors}
        register={register}
        key_name="description"
        label="Escribe la descripción de la marca"
      />
    </>
  );
};

export default BrandsForm;

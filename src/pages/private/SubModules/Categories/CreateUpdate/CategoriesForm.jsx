import React from "react";

import InputFormValidation from "../../../../../components/Inputs/InputFormValidation/InputFormValidation";
import InputSelect from "../../../../../components/Inputs/InputSelect";
import { show_in_ecomerce } from "../../../../../Utils/constants";
import { TitleIcon } from "../../../../../Utils/icons";

const CategoriesForm = ({
  showInEcomerce,
  errors,
  register,
  control,
  isUpdate,
}) => {
  return (
    <>
      <InputFormValidation
        Icon={TitleIcon}
        placeholder="Ingresa el nombre de la categoria"
        errors={errors}
        register={register}
        key_name="category_name"
        label="Escribe el nombre de la categoria"
      />

      <InputFormValidation
        Icon={TitleIcon}
        placeholder="Ingresa la descripción de la categoria"
        errors={errors}
        register={register}
        key_name="description"
        label="Escribe la descripción de la categoria"
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
    </>
  );
};

export default CategoriesForm;

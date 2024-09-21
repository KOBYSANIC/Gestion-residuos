import React from "react";

// icons
import { faFileLines } from "@fortawesome/free-solid-svg-icons";

// components
import InputFormValidation from "../../../../../components/Inputs/InputFormValidation/InputFormValidation";
import InputAsyncSelect from "../../../../../components/Inputs/InputSelect/InputAsyncSelect";

const CategoriaForm = ({ errors, register, control }) => {
  return (
    <>
      <InputFormValidation
        Icon={faFileLines}
        placeholder="Escribe aquí el nombre de la ruta"
        errors={errors}
        register={register}
        key_name="nombre_ruta"
        label="Ingresa el nombre de la ruta"
      />

      <InputFormValidation
        Icon={faFileLines}
        placeholder="Escibe aquí la descripción"
        errors={errors}
        register={register}
        key_name="descripcion_ruta"
        label="Escribe la descripción"
      />

      <InputAsyncSelect
        placeholder="Selecciona una opción"
        errors={errors}
        control={control}
        key_name="vehiculo_id"
        label="Selecciona el vehículo"
        validation
        valueKey="id"
        labelKey="placa"
        collection_name="vehiculos"
        search_field_name="placa"
      />
    </>
  );
};

export default CategoriaForm;

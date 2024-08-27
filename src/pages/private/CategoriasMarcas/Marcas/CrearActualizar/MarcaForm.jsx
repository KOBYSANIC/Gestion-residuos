import React from "react";

// icons
import { faFileLines } from "@fortawesome/free-solid-svg-icons";

// components
import InputFormValidation from "../../../../../components/Inputs/InputFormValidation/InputFormValidation";
import InputSelect from "../../../../../components/Inputs/InputSelect";

const MarcaForm = ({ errors, register, control }) => {
  return (
    <>
      <InputFormValidation
        Icon={faFileLines}
        placeholder="Ingresa la placa del vehículo"
        errors={errors}
        register={register}
        key_name="placa"
        label="Escribe la placa del vehículo"
      />

      <InputSelect
        options={[
          { value: "Pickup", label: "Pickup" },
          { value: "Camión", label: "Camión" },
        ]}
        placeholder="Selecciona una opción"
        errors={errors}
        register={register}
        control={control}
        key_name={"tipo"}
        label="Selecciona el tipo de vehículo"
        validation
      />

      <InputFormValidation
        Icon={faFileLines}
        placeholder="Ingresa la capacidad del vehículo"
        errors={errors}
        register={register}
        key_name="capacidad"
        label="Escribe la capacidad del vehículo"
      />
    </>
  );
};

export default MarcaForm;

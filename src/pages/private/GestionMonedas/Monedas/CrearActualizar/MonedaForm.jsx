import React, { useState } from "react";

// icons
import {
  faFileLines,
  faMoneyBill,
  faMoneyBillTransfer,
} from "@fortawesome/free-solid-svg-icons";

// components
import InputFormValidation from "../../../../../components/Inputs/InputFormValidation/InputFormValidation";
import InputSelect from "../../../../../components/Inputs/InputSelect";
import { Box } from "@chakra-ui/react";
import Title from "../../../../../components/Texts/Title";
import { flags } from "../../../../../Utils/flags";

const MonedaForm = ({
  errors,
  register,
  control,
  monedaSelected,
  isUpdate,
}) => {
  const [moneda, setMoneda] = useState({
    nombre_moneda_conversion: isUpdate
      ? monedaSelected?.nombre_moneda_conversion
      : "Moneda",
    siglas_moneda_conversion: isUpdate
      ? monedaSelected?.siglas_moneda_conversion
      : "---",
  });

  return (
    <>
      <InputFormValidation
        Icon={faFileLines}
        placeholder="Ingresa el nombre de la moneda"
        errors={errors}
        register={register}
        key_name="nombre_moneda_conversion"
        label="Escribe el nombre de la moneda"
        onChange={(e) => {
          setMoneda({ ...moneda, nombre_moneda_conversion: e.target.value });
        }}
      />
      <InputFormValidation
        Icon={faFileLines}
        placeholder="Ingresa las siglas de la moneda"
        errors={errors}
        register={register}
        key_name="siglas_moneda_conversion"
        label="Escribe las siglas de la moneda"
        minLength={2}
        onChange={(e) => {
          setMoneda({ ...moneda, siglas_moneda_conversion: e.target.value });
        }}
      />
      <InputSelect
        options={flags}
        placeholder="Selecciona la bandera"
        errors={errors}
        register={register}
        control={control}
        key_name="flag"
        label="Selecciona la bandera"
        validation={true}
      />

      <Box display={{ base: "none", md: "block" }} />
      <Title content="Conversión de moneda" />
      <Box display={{ base: "none", md: "block" }} />

      <InputFormValidation
        Icon={faMoneyBill}
        placeholder="Cantidad en dolares"
        errors={errors}
        register={register}
        key_name="dolar"
        label="Dolar Estadounidense (USD)"
        type="number"
        step="any"
        noScroll
        minLength={1}
        disabled
      />

      <InputFormValidation
        Icon={faMoneyBillTransfer}
        placeholder={`Cantidad en ${moneda.nombre_moneda_conversion}`}
        errors={errors}
        register={register}
        key_name="conversion"
        label={`${moneda.nombre_moneda_conversion} (${moneda.siglas_moneda_conversion})`}
        type="number"
        step="any"
        noScroll
        minLength={1}
      />
    </>
  );
};

export default MonedaForm;

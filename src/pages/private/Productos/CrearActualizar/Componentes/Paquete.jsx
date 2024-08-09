import React from "react";
import InputFormValidation from "../../../../../components/Inputs/InputFormValidation/InputFormValidation";
import {
  faFileLines,
  faMoneyBillTrendUp,
  faMoneyBillWave,
  faTruckRampBox,
} from "@fortawesome/free-solid-svg-icons";

const Paquete = ({ errors, register, index, descuento, precio }) => {
  return (
    <>
      <InputFormValidation
        Icon={faFileLines}
        placeholder="E.j: 250 Diamantes"
        errors={errors}
        register={register}
        key_name={`precios.${index}.titulo_precio`}
        name_array={"titulo_precio"}
        label="Escribe el título del paquete"
      />
      <InputFormValidation
        Icon={faMoneyBillWave}
        placeholder="Ingresa el precio del paquete en dolares"
        errors={errors}
        register={register}
        key_name={`precios.${index}.precio`}
        name_array={"precio"}
        label="Escribe el precio del paquete en dolares"
        type="number"
        step="any"
        minLength={1}
        noScroll
      />
      <InputFormValidation
        Icon={faTruckRampBox}
        placeholder="Ingresa el stock del paquete"
        errors={errors}
        register={register}
        key_name={`precios.${index}.producto_stock`}
        name_array={"producto_stock"}
        label="Escribe el stock del paquete"
        type="number"
        step="any"
        minLength={1}
        noScroll
        validation={false}
      />
      <InputFormValidation
        Icon={faMoneyBillTrendUp}
        placeholder="Ingresa el precio especial del paquete en dolares"
        errors={errors}
        register={register}
        key_name={`precios.${index}.precio_especial`}
        name_array={"precio_especial"}
        label="Escribe el precio especial del paquete en dolares"
        type="number"
        step="any"
        minLength={1}
        noScroll
        required={false}
        textBottom={`Porcentaje de descuento: ${(
          ((descuento || 0) / (precio || 0)) *
          100
        ).toFixed(2)}%`}
        max={precio}
      />
    </>
  );
};

export default Paquete;

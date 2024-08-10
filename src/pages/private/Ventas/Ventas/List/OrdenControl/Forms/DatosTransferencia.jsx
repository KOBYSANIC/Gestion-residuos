import { Grid } from "@chakra-ui/react";
import React from "react";
import InputFormValidation from "../../../../../../../components/Inputs/InputFormValidation/InputFormValidation";
import {
  faCalendarAlt,
  faMapLocationDot,
} from "@fortawesome/free-solid-svg-icons";

const DatosTransferencia = ({ orderSelected, register, errors }) => {
  return (
    <>
      <InputFormValidation
        Icon={faCalendarAlt}
        errors={errors}
        register={register}
        key_name="fecha_recoleccion_reciclador"
        type="date"
        label="Ingresa la fecha en la que se realizara la recolección (opcional)"
        // required={false}
      />

      <InputFormValidation
        Icon={faMapLocationDot}
        placeholder="Escribe aquí un comentario"
        errors={errors}
        register={register}
        key_name="comentario_reciclador"
        label="Ingresa un comentario (opcional)"
        required={false}
      />
    </>
  );
};

export default DatosTransferencia;

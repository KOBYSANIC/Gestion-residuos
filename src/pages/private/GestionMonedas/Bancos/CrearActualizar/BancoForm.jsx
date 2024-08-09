import React from "react";

// icons
import {
  faBuildingColumns,
  faEnvelope,
  faFileSignature,
  faIdCard,
  faMoneyCheck,
  faPaperclip,
  faSquarePhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

// components
import InputFormValidation from "../../../../../components/Inputs/InputFormValidation/InputFormValidation";
import InputSelect from "../../../../../components/Inputs/InputSelect";
import { Box } from "@chakra-ui/react";
import InputUploadFile from "../../../../../components/Inputs/InputUploadFile";
import InputJodit from "../../../../../components/Inputs/InputJodit/InputJodit";
const BancoForm = ({ errors, register, control, valorInput }) => {
  return (
    <>
      <InputSelect
        options={[
          { value: "Virtual", label: "Cuenta virtual" },
          { value: "Fisico", label: "Cuenta fisica" },
        ]}
        placeholder="Enséñame"
        errors={errors}
        register={register}
        control={control}
        key_name="tipo_banco"
        label="Selecciona el tipo de banco a usar"
        validation
      />
      <Box display={{ base: "none", md: "block" }} />
      <InputFormValidation
        Icon={faBuildingColumns}
        placeholder="E.j: Venezuela"
        errors={errors}
        register={register}
        key_name="nombre_banco"
        label="Nombre del banco"
        validation
      />
      <InputFormValidation
        Icon={faUser}
        placeholder="E.j: arturovegag"
        errors={errors}
        register={register}
        key_name="usuario_banco"
        label="Usuario del banco"
        validation={false}
      />
      {/* Validacion para cambiar los inputs que aparecen en el formulario */}
      {valorInput?.value === "Fisico" ? (
        <>
          <InputFormValidation
            Icon={faFileSignature}
            placeholder="E.j: Luis Vega"
            errors={errors}
            register={register}
            key_name="nombre_titular"
            label="Nombre del titular de la cuenta"
            validation
          />
          <InputFormValidation
            Icon={faMoneyCheck}
            placeholder="E.j: 01021299219298328383"
            errors={errors}
            register={register}
            key_name="numero_banco"
            label="Numero de cuenta del banco"
            validation
            type="number"
          />
          <InputFormValidation
            Icon={faSquarePhone}
            placeholder="E.j: +584125580571"
            errors={errors}
            register={register}
            key_name="numero_teléfono"
            label="Número de teléfono"
            validation
            type="number"
          />
          <InputFormValidation
            Icon={faIdCard}
            placeholder="E.j: 30.605.255"
            errors={errors}
            register={register}
            key_name="documento_identidad"
            label="Documento de identidad asociado al banco"
            validation
            type="number"
          />
        </>
      ) : (
        <InputFormValidation
          Icon={faEnvelope}
          placeholder="E.j: arturovegag@gmail.com"
          errors={errors}
          register={register}
          key_name="correo_electronico"
          label="Correo electrónico"
          validation
          type="email"
        />
      )}

      <InputJodit
        placeholder="E.j: Para realizar la transferencia..."
        errors={errors}
        control={control}
        register={register}
        key_name="indicaciones_transferencia"
        label="Indicaciones para la transferencia"
      />

      <InputUploadFile
        errors={errors}
        register={register}
        key_name="imagen_banco"
        label="Sube el logo del banco"
        control={control}
        validation
      />
    </>
  );
};

export default BancoForm;

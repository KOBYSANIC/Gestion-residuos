import React from "react";

import InputFormValidation from "../../../../../components/Inputs/InputFormValidation/InputFormValidation";
import InputSelect from "../../../../../components/Inputs/InputSelect";
import { user_role, user_status } from "../../../../../Utils/constants";

import {
  faAddressCard,
  faEnvelope,
  faKey,
} from "@fortawesome/free-solid-svg-icons";

const UsersForm = ({ errors, register, control, isUpdate }) => {
  return (
    <>
      <InputFormValidation
        Icon={faAddressCard}
        placeholder="Ingresa el nombre usuario"
        errors={errors}
        register={register}
        key_name="user_name"
        label="Escribe el nombre del usuario"
      />

      <InputFormValidation
        type="email"
        Icon={faEnvelope}
        placeholder="Ingresa el correo usuario"
        errors={errors}
        register={register}
        key_name="email"
        label="Escribe el correo del usuario"
        disabled={isUpdate}
      />

      <InputSelect
        options={user_role}
        placeholder="Selecciona el rol del usuario"
        errors={errors}
        register={register}
        control={control}
        key_name="user_role"
        label="Selecciona el rol del usuario"
        validation={true}
      />

      {isUpdate && (
        <InputSelect
          options={user_status}
          placeholder="Selecciona el estado del usuario"
          errors={errors}
          register={register}
          control={control}
          key_name="active"
          label="Selecciona el estado del usuario"
          validation={true}
        />
      )}

      {!isUpdate && (
        <InputFormValidation
          type="password"
          Icon={faKey}
          placeholder="Ingresa la contraseña del usuario"
          errors={errors}
          register={register}
          key_name="password"
          label="Escribe la contraseña del usuario"
        />
      )}
    </>
  );
};

export default UsersForm;

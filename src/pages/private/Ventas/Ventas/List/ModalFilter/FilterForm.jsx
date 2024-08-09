import React from "react";

import InputSelect from "../../../../../../components/Inputs/InputSelect";
import { status_order } from "../../../../../../Utils/constants";
import InputAsyncSelect from "../../../../../../components/Inputs/InputSelect/InputAsyncSelect";
import InputFormValidation from "../../../../../../components/Inputs/InputFormValidation/InputFormValidation";
import { faCalendarMinus } from "@fortawesome/free-solid-svg-icons";

const FilterForm = ({ eventState, errors, register, control }) => {
  return (
    <>
      <InputSelect
        options={status_order}
        defaultOptionValue={eventState}
        placeholder="Selecciona una opción"
        errors={errors}
        register={register}
        control={control}
        key_name="order_state"
        label="Filtra por estado de la orden"
      />

      <InputAsyncSelect
        placeholder="Selecciona una opción"
        errors={errors}
        control={control}
        key_name="id_user"
        label="Filtra por correo"
        valueKey="id"
        labelKey="email"
        collection_name="users"
        search_field_name="buscar_correo"
        filter_active={false}
        extraOptions={[
          {
            email: "Usuario no registrado",
            id: "no_user",
            buscar_correo: "usuario no registrado",
            buscar_user_id: "usuario no registrado",
          },
        ]}
      />

      <InputFormValidation
        Icon={faCalendarMinus}
        placeholder="Fecha de inicio"
        errors={errors}
        register={register}
        key_name={"fecha_inicio"}
        label="Fecha de inicio"
        type="date"
        required={false}
      />

      <InputFormValidation
        Icon={faCalendarMinus}
        placeholder="Fecha fin"
        errors={errors}
        register={register}
        key_name={"fecha_fin"}
        label="Fecha fin"
        type="date"
        required={false}
      />
    </>
  );
};

export default FilterForm;

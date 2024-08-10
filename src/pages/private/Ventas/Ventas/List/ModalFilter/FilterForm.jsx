import React from "react";

import InputSelect from "../../../../../../components/Inputs/InputSelect";
import { status_order } from "../../../../../../Utils/constants";
import InputFormValidation from "../../../../../../components/Inputs/InputFormValidation/InputFormValidation";
import { faCalendarMinus } from "@fortawesome/free-solid-svg-icons";

const FilterForm = ({ eventState, errors, register, control }) => {
  return (
    <>
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

      <InputSelect
        options={status_order}
        defaultOptionValue={eventState}
        placeholder="Selecciona una opción"
        errors={errors}
        register={register}
        control={control}
        key_name="order_state"
        label="Filtra por estado de la recolección"
      />
    </>
  );
};

export default FilterForm;

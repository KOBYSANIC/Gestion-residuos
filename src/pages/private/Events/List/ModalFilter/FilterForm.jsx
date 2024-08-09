import React from "react";

import InputFormValidation from "../../../../../components/Inputs/InputFormValidation/InputFormValidation";
import InputSelect from "../../../../../components/Inputs/InputSelect";
import { event_state } from "../../../../../Utils/constants";

import { DateIcon } from "../../../../../Utils/icons";

const FilterForm = ({ eventState, errors, register, control }) => {
  return (
    <>
      <InputFormValidation
        Icon={DateIcon}
        placeholder="Selecciona la fecha inicial"
        errors={errors}
        register={register}
        key_name="event_start_date"
        label="Selecciona la fecha final del evento"
        type="date"
      />

      <InputFormValidation
        Icon={DateIcon}
        placeholder="Selecciona la fecha final"
        errors={errors}
        register={register}
        key_name="event_end_date"
        label="Selecciona la fecha final del evento"
        type="date"
      />

      <InputSelect
        options={event_state}
        defaultOptionValue={eventState}
        placeholder="Estado del evento"
        errors={errors}
        register={register}
        control={control}
        key_name="event_state"
        label="Selecciona el estado del evento"
      />
    </>
  );
};

export default FilterForm;

import React from "react";

import InputSelect from "../../../../../components/Inputs/InputSelect";
import { order_state } from "../../../../../Utils/constants";

const FilterForm = ({ eventState, errors, register, control }) => {
  return (
    <>
      <InputSelect
        options={order_state}
        defaultOptionValue={eventState}
        placeholder="Estado de la orden"
        errors={errors}
        register={register}
        control={control}
        key_name="order_state"
        label="Selecciona el estado de la orden"
      />
    </>
  );
};

export default FilterForm;

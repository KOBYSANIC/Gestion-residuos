import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import ModalForm from "../../../../../components/Modal/ModalForm";
import {
  getEvents,
  setEventStateFilter,
} from "../../../../../redux/features/eventSlice";
import { FilterBlueIcon } from "../../../../../Utils/icons";
import FilterForm from "./FilterForm";

const ModalFilter = ({ isOpen, onClose }) => {
  const {
    // getValues,
    register,
    handleSubmit,
    control,
    formState: { errors },
    // reset,
  } = useForm();

  const dispatch = useDispatch();

  const onSubmit = (data) => {
    dispatch(setEventStateFilter(data));
    dispatch(getEvents({ isNextPage: false, isPrevPage: false }));
    onClose();
  };

  return (
    <ModalForm
      titleModal="Filtros"
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      // loadingButtonSubmit={loading_validate_date_time}
      imageIconTitle={FilterBlueIcon}
      textButtonSubmit="Aplicar filtros"
    >
      <FilterForm errors={errors} register={register} control={control} />
    </ModalForm>
  );
};

export default ModalFilter;

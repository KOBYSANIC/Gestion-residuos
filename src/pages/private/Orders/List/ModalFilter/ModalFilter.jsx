import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import ModalForm from "../../../../../components/Modal/ModalForm";
import { getOrders, setOrderStateFilter } from "../../../../../redux/features/orderSlice";
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
    dispatch(setOrderStateFilter(data));
    dispatch(getOrders({ isNextPage: false, isPrevPage: false }));
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

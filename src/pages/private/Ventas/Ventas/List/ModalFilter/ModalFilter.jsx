import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import ModalForm from "../../../../../../components/Modal/ModalForm";
import { FilterBlueIcon } from "../../../../../../Utils/icons";
import FilterForm from "./FilterForm";
import { getVentas } from "../../../../../../redux/features/ventaSlice";

const ModalFilter = ({ isOpen, onClose, search, setFilter }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const [newErrors, setNewErrors] = useState({});
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    const parseData = {
      ...data,
      id_user: data.id_user || "",
    };

    if (parseData?.fecha_inicio && parseData?.fecha_fin) {
      if (parseData?.fecha_inicio > parseData?.fecha_fin) {
        setNewErrors({
          fecha_inicio: {
            type: "futureDate",
            message: `La fecha debe ser menor o igual que ${parseData?.fecha_fin}`,
          },
        });
        return;
      }

      if (parseData?.fecha_fin < parseData?.fecha_inicio) {
        setNewErrors({
          fecha_fin: {
            type: "futureDate",
            message: `La fecha debe ser mayor o igual que ${parseData?.fecha_inicio}`,
          },
        });
        return;
      }
    }

    setNewErrors({});
    setFilter(parseData);
    dispatch(
      getVentas({
        isNextPage: false,
        isPrevPage: false,
        search: search,
        filter: parseData,
      })
    );

    onClose();
  };

  return (
    <ModalForm
      titleModal="Filtros"
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      imageIconTitle={FilterBlueIcon}
      textButtonSubmit="Aplicar filtros"
    >
      <FilterForm
        errors={newErrors || errors}
        register={register}
        control={control}
      />
    </ModalForm>
  );
};

export default ModalFilter;

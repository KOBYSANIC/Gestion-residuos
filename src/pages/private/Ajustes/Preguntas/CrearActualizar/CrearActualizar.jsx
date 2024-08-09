import React, { useEffect } from "react";

// react-hook-form
import { useForm } from "react-hook-form";

// chakra
import { Skeleton } from "@chakra-ui/react";

// redux
import { useDispatch, useSelector } from "react-redux";
import {
  createPregunta,
  loadingActions,
  selectIsUpdate,
  selectPreguntaDataUpdate,
  updatePregunta,
} from "../../../../../redux/features/preguntaSlice";

// components
import ModalForm from "../../../../../components/Modal/ModalForm";
import PreguntaForm from "./PreguntaForm";

const CrearActualizar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  // selectores de redux
  const preguntaSelected = useSelector(selectPreguntaDataUpdate);
  const loading = useSelector(loadingActions);
  const isUpdate = useSelector(selectIsUpdate);
  const modalTitle = isUpdate ? "Editar Pregunta" : "Nueva Pregunta";
  const buttonTitle = isUpdate ? "Actualizar Pregunta" : "Agregar Pregunta";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const loading_save = useSelector(loadingActions);

  const onSubmit = (data) => {
    if (isUpdate) {
      dispatch(updatePregunta({ ...data, onClose, reset }));
    } else {
      dispatch(createPregunta({ ...data, onClose, reset }));
    }
  };

  useEffect(() => {
    if (isUpdate) {
      reset(preguntaSelected);
    } else {
      reset({});
    }
  }, [isUpdate, preguntaSelected]);

  return (
    <>
      <ModalForm
        titleModal={modalTitle}
        isOpen={isOpen}
        onClose={onClose}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        textButtonClose="Cancelar"
        textButtonSubmit={buttonTitle}
        loadingButtonSubmit={loading_save}
      >
        {loading && isUpdate ? (
          <>
            <Skeleton
              height="80px"
              boxShadow="card"
              borderRadius="10px"
              startColor="brand.disabled"
              endColor="brand.gray3"
            />
            <Skeleton
              height="80px"
              boxShadow="card"
              borderRadius="10px"
              startColor="brand.disabled"
              endColor="brand.gray3"
            />
          </>
        ) : (
          <PreguntaForm errors={errors} register={register} />
        )}
      </ModalForm>
    </>
  );
};

export default CrearActualizar;

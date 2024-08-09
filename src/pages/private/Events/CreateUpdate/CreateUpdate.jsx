import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { useDispatch, useSelector } from "react-redux";
import {
  selectEventDataUpdate,
  selectLoadingUpdateEvent,
  validateAndCreateUpdate,
} from "../../../../redux/features/eventSlice";

import ModalForm from "../../../../components/Modal/ModalForm";
import EventsForm from "./EventsForm";
import { Skeleton } from "@chakra-ui/react";

const CreateUpdate = ({ isOpen, onClose }) => {
  const [eventState, setEventState] = useState(0);
  const [images, setImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const eventSelected = useSelector(selectEventDataUpdate);
  const loading = useSelector(selectLoadingUpdateEvent);
  const isUpdate = useSelector((state) => state.event.isUpdate);
  const dispatch = useDispatch();
  const modalTitle = isUpdate ? "Editar evento" : "Nuevo evento";
  const buttonTitle = isUpdate ? "Actualizar evento" : "Agregar evento";

  const {
    getValues,
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const loading_validate_date_time = useSelector(
    (state) => state.event.loading_validate_date_time
  );

  const onSubmit = (data) => {
    dispatch(
      validateAndCreateUpdate({
        ...data,
        onClose,
        reset,
        isUpdate,
        images,
        imagesToDelete,
        setImages,
        setImagesToDelete,
      })
    );
  };

  useEffect(() => {
    if (isUpdate) {
      reset(eventSelected);
    } else {
      reset({});
    }
  }, [isUpdate, eventSelected]);

  useEffect(() => {
    const values = getValues();
    if (values.event_state) setEventState(values.event_state - 1);
  }, [eventSelected]);

  useEffect(() => {
    if (
      eventSelected &&
      eventSelected.event_images !== undefined &&
      eventSelected.event_images.length > 0 &&
      isUpdate
    ) {
      setImages(eventSelected.event_images);
    }
  }, [eventSelected, isUpdate]);

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
        loadingButtonSubmit={loading_validate_date_time}
        isCentered={false}
      >
        {loading ? (
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
            <Skeleton
              height="160px"
              boxShadow="card"
              borderRadius="10px"
              startColor="brand.disabled"
              endColor="brand.gray3"
            />
          </>
        ) : (
          <EventsForm
            errors={errors}
            getValues={getValues}
            register={register}
            control={control}
            eventState={eventState}
            images={images}
            imagesToDelete={imagesToDelete}
            setImages={setImages}
            setImagesToDelete={setImagesToDelete}
            isUpdate={isUpdate}
          />
        )}
      </ModalForm>
    </>
  );
};

export default CreateUpdate;

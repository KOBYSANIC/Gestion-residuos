import React, { useEffect } from "react";

import InputFormValidation from "../../../../components/Inputs/InputFormValidation/InputFormValidation";
import InputSelect from "../../../../components/Inputs/InputSelect";
import InputTextArea from "../../../../components/Inputs/InputTextArea";
import InputUploadFile from "../../../../components/Inputs/InputUploadFile";
import { event_pay, event_states } from "../../../../Utils/constants";

import { DateIcon, PerfilIcon, TitleIcon } from "../../../../Utils/icons";

const EventsForm = ({
  eventState,
  errors,
  register,
  control,
  getValues,
  images,
  imagesToDelete,
  setImages,
  setImagesToDelete,
  isUpdate,
}) => {
  const [isPayOnSite, setIsPayOnSite] = React.useState();
  const values = getValues();

  useEffect(() => {
    setIsPayOnSite(values.is_pay_on_site);
    return () => {
      setIsPayOnSite(1);
    };
  }, [values.is_pay_on_site]);

  return (
    <>
      <InputFormValidation
        Icon={PerfilIcon}
        placeholder="Ingresa el nombre del evento"
        errors={errors}
        register={register}
        key_name="event_name"
        label="Escribe el nombre del evento"
      />

      <InputSelect
        options={event_states}
        defaultOptionValue={eventState}
        placeholder="Estado del evento"
        errors={errors}
        register={register}
        control={control}
        key_name="event_state"
        label="Selecciona el estado del evento"
        disabled={true}
      />

      <InputFormValidation
        Icon={DateIcon}
        placeholder="Ingresa la fecha de inicio"
        errors={errors}
        register={register}
        key_name="event_start_date"
        label="Selecciona la fecha del evento"
        type="date"
      />

      <InputFormValidation
        Icon={PerfilIcon}
        placeholder="Ingresa la hora de inicio"
        errors={errors}
        register={register}
        key_name="event_start_time"
        label="Selecciona la hora del evento"
        type="time"
      />
      <InputTextArea
        Icon={PerfilIcon}
        placeholder="Ingresa la descripcion del evento"
        errors={errors}
        register={register}
        key_name="event_description"
        label="Escribe la descripcion del evento"
      />

      <InputSelect
        options={event_pay}
        defaultOptionValue={isPayOnSite !== undefined ? isPayOnSite - 1 : 1}
        placeholder="Pago Contra entrega"
        errors={errors}
        register={register}
        control={control}
        key_name="is_pay_on_site"
        label="¿Aplica pago contra entrega?"
        isSetValue
        setValue={setIsPayOnSite}
        children={
          isPayOnSite == 1 && (
            <InputFormValidation
              Icon={TitleIcon}
              placeholder="Ingresa el monto a cobrar"
              errors={errors}
              register={register}
              key_name="amount_collected"
              label="Escribe el monto a cobrar"
              type="number"
              validation={isPayOnSite == 1}
              step="any"
              noScroll
              mt={"6px"}
              minLength={1}
            />
          )
        }
      />

      <InputUploadFile
        Icon={TitleIcon}
        placeholder="Ingresa una imagen"
        errors={errors}
        register={register}
        key_name="event_images"
        label="Sube una imagen del evento"
        images={images}
        imagesToDelete={imagesToDelete}
        isUpdate={isUpdate}
        setImages={setImages}
        setImagesToDelete={setImagesToDelete}
        linkImage={true}
      />
    </>
  );
};

export default EventsForm;

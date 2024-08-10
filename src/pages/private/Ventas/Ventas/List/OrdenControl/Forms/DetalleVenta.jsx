import { Grid, Skeleton } from "@chakra-ui/react";
import React, { useEffect } from "react";
import InputFormValidation from "../../../../../../../components/Inputs/InputFormValidation/InputFormValidation";
import {
  faCalendarAlt,
  faFileLines,
  faMapLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { useFieldArray, useForm } from "react-hook-form";
import InputSelect from "../../../../../../../components/Inputs/InputSelect";
import TextContent from "../../../../../../../components/Texts/TextContent";
import { PRECIO_BOLSA } from "../../../../../../../Utils/constants";
import { formatCurrency } from "../../../../../../../Utils/currency";

const DetalleVenta = ({
  orderSelected,
  loading,
  reset,
  register,
  control,
  errors,
  isView,
}) => {
  const { fields } = useFieldArray({
    control,
    name: "residuos",
  });

  useEffect(() => {
    reset(orderSelected);
  }, [orderSelected]);
  return (
    <Skeleton
      isLoaded={!loading}
      height="100%"
      width="100%"
      borderRadius="10px"
      startColor="brand.gray2"
      endColor="brand.disabled"
    >
      <>
        <Grid
          gridColumn={{ base: "span 2" }}
          rowGap={4}
          columnGap={20}
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
          position="relative"
          mb={6}
        >
          <InputFormValidation
            Icon={faCalendarAlt}
            errors={errors}
            register={register}
            key_name="fecha_recoleccion_reciclador"
            type="date"
            label="Ingresa la fecha en la que se realizara la recolección (opcional)"
            required={false}
            disabled={isView}
          />

          <InputFormValidation
            Icon={faMapLocationDot}
            placeholder="Escribe aquí un comentario"
            errors={errors}
            register={register}
            key_name="comentario_reciclador"
            label="Ingresa un comentario (opcional)"
            required={false}
            disabled={isView}
          />

          <InputFormValidation
            Icon={faMapLocationDot}
            placeholder="Escribe aquí el monto cobrado de la recolección"
            errors={errors}
            register={register}
            key_name="monto_cobrado"
            type="number"
            label="Ingresa el monto cobrado de la recolección"
            disabled={isView}
            minLength={1}
          />
          <InputFormValidation
            Icon={faMapLocationDot}
            placeholder="Escribe aquí su ubicación para la recolección"
            errors={errors}
            register={register}
            key_name="ubicacion"
            label="Ubicación de la recolección"
            disabled
            required={false}
          />

          <InputFormValidation
            Icon={faCalendarAlt}
            errors={errors}
            register={register}
            key_name="fecha_recoleccion"
            type="date"
            label="Fecha solicitada de recolección"
            disabled
            required={false}
          />

          <InputFormValidation
            Icon={faMapLocationDot}
            placeholder="Escribe aquí un comentario"
            errors={errors}
            register={register}
            key_name="comentario"
            label="Comentario del cliente"
            required={false}
            disabled
          />
        </Grid>
        {fields.map((item, index) => (
          <Grid
            key={`grid_${index}`}
            gridColumn={{ base: "span 2" }}
            rowGap={8}
            columnGap={20}
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
            borderColor="brand.gray_light"
            px={5}
            py={5}
            pt={8}
            borderWidth="1px"
            borderStyle="dashed"
            rounded="md"
            position="relative"
            required={false}
          >
            <InputSelect
              options={[
                { value: 1, label: "Residuos domésticos" },
                { value: 2, label: "Residuos comerciales" },
                { value: 3, label: "Residuos industriales" },
                { value: 4, label: "Residuos peligroso" },
              ]}
              placeholder="Selecciona una opción"
              errors={errors?.residuos?.[index]}
              register={register}
              control={control}
              key_name={`residuos.${index}.tipo_residuo`}
              name_array={"tipo_residuo"}
              label="Tipo de residuo"
              disabled
            />
            <InputFormValidation
              Icon={faFileLines}
              placeholder=""
              errors={errors?.residuos?.[index]}
              register={register}
              key_name={`residuos.${index}.peso`}
              name_array={"peso"}
              type="number"
              label="Peso aproximado del residuo en libras"
              minLength={1}
              noScroll
              disabled
              required={false}
            />
          </Grid>
        ))}
        <TextContent
          fontSize="2xl"
          fontWeight="bold"
          content={`Precio aproxmado de la recolección: ${formatCurrency(
            fields.length * PRECIO_BOLSA
          )}`}
        />
      </>
    </Skeleton>
  );
};

export default DetalleVenta;

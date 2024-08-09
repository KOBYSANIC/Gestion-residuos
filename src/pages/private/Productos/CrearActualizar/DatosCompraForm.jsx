import { Box, Grid } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useFieldArray } from "react-hook-form";
import InputFormValidation from "../../../../components/Inputs/InputFormValidation/InputFormValidation";
import {
  faCalendarAlt,
  faFileLines,
  faMapLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { AddButton } from "../../../../components/Buttons/AddButton";
import InputSelect from "../../../../components/Inputs/InputSelect";
import TableButton from "../../../../components/Buttons/TableButton/TableButton";
import toast from "react-hot-toast";

const DatosCompraForm = ({ errors, register, control }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "residuos",
  });

  const handleRemove = (index) => {
    remove(index);
  };

  useEffect(() => {
    if (fields.length === 0) {
      append({ tipo_residuo: "", peso: "" });
    }
  }, [fields]);

  return (
    <>
      <InputFormValidation
        Icon={faMapLocationDot}
        placeholder="Escribe aquí su ubicación para la recolección"
        errors={errors}
        register={register}
        key_name="ubicacion"
        label="Ingresa la ubicación de la recolección"
      />

      <InputFormValidation
        Icon={faCalendarAlt}
        errors={errors}
        register={register}
        key_name="fecha_recoleccion"
        type="date"
        label="Ingresa la fecha de la recolección"
      />

      <InputFormValidation
        Icon={faMapLocationDot}
        placeholder="Escribe aquí un comentario"
        errors={errors}
        register={register}
        key_name="comentario"
        label="Ingresa un comentario (opcional)"
        required={false}
      />

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
            label="Selecciona el tipo de residuo"
            validation
          />
          <InputFormValidation
            Icon={faFileLines}
            placeholder="Escribe aquí el peso del residuo"
            errors={errors?.residuos?.[index]}
            register={register}
            key_name={`residuos.${index}.peso`}
            name_array={"peso"}
            type="number"
            label="Ingresa el peso del residuo en libras"
            minLength={1}
            noScroll
          />
          <Box position="absolute" right={0} top={1}>
            <TableButton
              items={[
                {
                  name: "Eliminar",
                  onClick: () => {
                    if (fields.length > 1) handleRemove(index);
                    else toast.error("Error: Debe haber al menos un residuo");
                  },
                  hidden: false,
                },
              ]}
            ></TableButton>
          </Box>
        </Grid>
      ))}
      <AddButton content="Agregar nuevo residuo" onClick={() => append()} />
    </>
  );
};

export default DatosCompraForm;

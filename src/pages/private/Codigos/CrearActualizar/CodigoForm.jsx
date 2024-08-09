import React from "react";
import { Box, Grid } from "@chakra-ui/react";
import { useFieldArray } from "react-hook-form";
import InputFormValidation from "../../../../components/Inputs/InputFormValidation/InputFormValidation";
import { faFileLines, faCheck } from "@fortawesome/free-solid-svg-icons";
import { AddButton } from "../../../../components/Buttons/AddButton";
import InputAsyncSelect from "../../../../components/Inputs/InputSelect/InputAsyncSelect";
import TableButton from "../../../../components/Buttons/TableButton/TableButton";

const CodigoForm = ({ errors, register, control }) => {
  const { fields, append, remove, insert, prepend } = useFieldArray({
    control,
    name: "codigos",
  });

  const initialState = {
    nombre_codigo: "",
    estado: "Activo",
  };

  const handlePrepend = () => {
    prepend(initialState);
  };

  const handleInsert = (index) => {
    insert(index + 1, initialState);
  };

  const handleRemove = (index) => {
    remove(index);
  };

  return (
    <>
      <InputFormValidation
        Icon={faFileLines}
        placeholder="Ej: Listado de códigos para Xbox"
        errors={errors}
        register={register}
        key_name={`nombre_listado`}
        label="Escribe el nombre del listado"
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
          <InputFormValidation
            Icon={faFileLines}
            placeholder="Ingresa el nombre del código"
            errors={errors?.codigos?.[index]}
            register={register}
            key_name={`codigos.${index}.nombre_codigo`}
            label="Escribe el nombre del código"
            name_array={"nombre_codigo"}
          />

          <InputFormValidation
            Icon={faCheck}
            placeholder="Ingresa el estado del código"
            errors={errors?.codigos?.[index]}
            register={register}
            key_name={`codigos.${index}.estado`}
            label="Estado del código"
            disabled={true}
            name_array={"estado"}
          />

          <Box position="absolute" right={0} top={1}>
            <TableButton
              items={[
                {
                  name: "Agregar al inicio",
                  onClick: handlePrepend,
                  hidden: false,
                },
                {
                  name: "Agregar debajo",
                  onClick: () => handleInsert(index),
                  hidden: false,
                },
                {
                  name: "Eliminar",
                  onClick: () => handleRemove(index),
                  hidden: false,
                },
              ]}
            ></TableButton>
          </Box>
        </Grid>
      ))}
      <AddButton
        content="Agregar un nuevo paquete"
        onClick={() => append(initialState)}
      />
    </>
  );
};

export default CodigoForm;

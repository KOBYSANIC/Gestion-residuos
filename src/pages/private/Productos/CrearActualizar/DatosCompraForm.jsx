import { Box, Grid } from "@chakra-ui/react";
import React from "react";
import { useFieldArray } from "react-hook-form";
import InputFormValidation from "../../../../components/Inputs/InputFormValidation/InputFormValidation";
import { faFileLines } from "@fortawesome/free-solid-svg-icons";
import { AddButton } from "../../../../components/Buttons/AddButton";
import InputSelect from "../../../../components/Inputs/InputSelect";
import TableButton from "../../../../components/Buttons/TableButton/TableButton";

const DatosCompraForm = ({ errors, register, control }) => {
  const { fields, append, remove, insert, prepend } = useFieldArray({
    control,
    name: "datos_compra",
  });

  const initialState = {
    tipo_dato: "",
    placeholder: "",
    require: "",
    name: "",
    name_input: "",
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
              { value: "number", label: "Númerico" },
              { value: "text", label: "Texto" },
              { value: "email", label: "Correo Electrónico" },
              { value: "tel", label: "Teléfono" },
            ]}
            placeholder="Selecciona una opción"
            errors={errors?.datos_compra?.[index]}
            register={register}
            control={control}
            key_name={`datos_compra.${index}.tipo_dato`}
            name_array={"tipo_dato"}
            label="Selecciona el tipo del input"
            validation
          />
          <InputFormValidation
            Icon={faFileLines}
            placeholder="Ej: Ingresa tu nombre completo"
            errors={errors?.datos_compra?.[index]}
            register={register}
            key_name={`datos_compra.${index}.label_input`}
            name_array={"label_input"}
            label="Ingresa el label del input"
            minLength={2}
            required={false}
          />
          <InputFormValidation
            Icon={faFileLines}
            placeholder="Ej: Ingrese su nombre completo"
            errors={errors?.datos_compra?.[index]}
            register={register}
            key_name={`datos_compra.${index}.placeholder`}
            name_array={"placeholder"}
            label="Ingresa el placeholder del input"
          />
          <InputSelect
            options={[
              { value: true, label: "Si" },
              { value: false, label: "No" },
            ]}
            placeholder="Selecciona una opción"
            errors={errors?.datos_compra?.[index]}
            register={register}
            control={control}
            key_name={`datos_compra.${index}.require`}
            name_array={"require"}
            label="¿El campo es obligatorio?"
            validation
          />
          <InputFormValidation
            Icon={faFileLines}
            placeholder="Ej: teléfono, correo"
            errors={errors?.datos_compra?.[index]}
            register={register}
            key_name={`datos_compra.${index}.name_input`}
            name_array={"name_input"}
            label="Ingresa name del input"
            minLength={2}
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
        content="Agregar nuevo dato de compra"
        onClick={() => append()}
      />
    </>
  );
};

export default DatosCompraForm;

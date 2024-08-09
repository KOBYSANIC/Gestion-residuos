import React from "react";

// icons
import { faFileLines } from "@fortawesome/free-solid-svg-icons";

// components
import InputFormValidation from "../../../../../components/Inputs/InputFormValidation/InputFormValidation";
import InputAsyncSelect from "../../../../../components/Inputs/InputSelect/InputAsyncSelect";
import InputSelect from "../../../../../components/Inputs/InputSelect";
import { Box, Grid } from "@chakra-ui/react";

// utils
import { flags } from "../../../../../Utils/flags";
import TableButton from "../../../../../components/Buttons/TableButton/TableButton";
import { AddButton } from "../../../../../components/Buttons/AddButton";
import { useFieldArray } from "react-hook-form";
import { product_status } from "../../../../../Utils/constants";

const MetodosPagoForm = ({ errors, register, control }) => {
  const { fields, append, remove, insert, prepend } = useFieldArray({
    control,
    name: "cuenta",
  });

  const initialState = {
    metodo_pago: "",
    porcentaje_comision: "",
    nota_adicional: "",
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
      <InputSelect
        options={flags}
        placeholder="Seleccionar opción"
        errors={errors}
        register={register}
        control={control}
        key_name="pais"
        label="Selecciona el pais"
        validation={true}
      />

      <InputSelect
        options={product_status}
        placeholder="Selecciona la opción"
        errors={errors}
        register={register}
        control={control}
        key_name="mostrar_en_tienda"
        label="¿Deseas mostrar el metodo de pago en la tienda?"
        validation
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
          <InputAsyncSelect
            placeholder="Selecciona una opción"
            errors={errors?.cuenta?.[index]}
            control={control}
            key_name={`cuenta.${index}.metodo_pago`}
            label="Selecciona banco"
            validation
            valueKey="id"
            labelKey="nombre_banco"
            collection_name="bancos"
            search_field_name="buscar_nombre"
            name_array={"metodo_pago"}
          />
          <InputFormValidation
            Icon={faFileLines}
            placeholder="Ej: 5 (Se calcula en base al total de la compra)"
            errors={errors?.cuenta?.[index]}
            register={register}
            key_name={`cuenta.${index}.porcentaje_comision`}
            label="Escribe el porcentaje de comisión"
            name_array={"porcentaje_comision"}
            type="number"
            minLength={1}
            required={false}
          />
          <InputFormValidation
            Icon={faFileLines}
            placeholder="Ej: El banco cobrará una comisión del 5% po el total del pago"
            errors={errors?.cuenta?.[index]}
            register={register}
            key_name={`cuenta.${index}.nota_adicional`}
            label="Nota adicional"
            name_array={"nota_adicional"}
            required={false}
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
        content="Agregar metodo de pago"
        onClick={() => append(initialState)}
      />
    </>
  );
};

export default MetodosPagoForm;

import React from "react";
import { useFieldArray } from "react-hook-form";
import { Grid } from "@chakra-ui/react";
import useGetCollection from "../../../../hooks/useGetCollection";
import Paquete from "./Componentes/Paquete";
import Descuentos from "./Componentes/Descuentos";
import Monedas from "./Componentes/Monedas";
import { AddButton } from "../../../../components/Buttons/AddButton";

const PreciosForm = ({ errors, register, watch, control }) => {
  const { dataCollection, loading } = useGetCollection("monedas");
  const { fields, append, remove, insert, prepend } = useFieldArray({
    control,
    name: "precios",
  });

  const initialState = {
    titulo_precio: "",
    precio: "",
    producto_stock: "",
    precio_especial: "",
    estado_descuento: "",
    fecha_fin_descuento: "",
    fecha_inicio_descuento: "",
    descuento: "",
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

  const estado_descuento = (key_name) => {
    return watch(key_name)?.value;
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
          <Paquete
            errors={errors?.precios?.[index]}
            register={register}
            index={index}
            descuento={watch(`precios.${index}.precio_especial`)}
            precio={watch(`precios.${index}.precio`)}
          />
          <Descuentos
            errors={errors?.precios?.[index]}
            register={register}
            control={control}
            index={index}
            estado_descuento={estado_descuento}
            fecha_inicio_descuento={watch(
              `precios.${index}.fecha_inicio_descuento`
            )}
            fecha_fin_descuento={watch(`precios.${index}.fecha_fin_descuento`)}
            descuento={watch(`precios.${index}.descuento`)}
            precio={watch(`precios.${index}.precio`)}
          />

          <Monedas
            dataCollection={dataCollection}
            index={index}
            handleRemove={handleRemove}
            handleInsert={handleInsert}
            handlePrepend={handlePrepend}
            precio={watch(`precios.${index}.precio`)}
            precio_especial={watch(`precios.${index}.precio_especial`)}
            precio_descuento={watch(`precios.${index}.descuento`)}
            estado_descuento={estado_descuento(
              `precios.${index}.estado_descuento`
            )}
            loading={loading}
          />
        </Grid>
      ))}
      <AddButton content="Agregar un nuevo paquete" onClick={() => append()} />
    </>
  );
};

export default PreciosForm;

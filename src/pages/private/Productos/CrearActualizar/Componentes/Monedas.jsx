import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Skeleton,
} from "@chakra-ui/react";
import React from "react";
import TableButton from "../../../../../components/Buttons/TableButton/TableButton";
import Table from "../../../../../components/Table";
import { columns } from "./columns";
import useColumns from "../../../../../hooks/useColumns";

const Monedas = ({
  dataCollection,
  index,
  loading,
  precio,
  precio_especial,
  precio_descuento,
  estado_descuento,
  handleRemove,
  handleInsert,
  handlePrepend,
}) => {
  const columnsRender = useColumns(columns());

  const dataConvert = dataCollection.map((item) => {
    const conversion = item.conversion;
    const precioConverted = (precio || 0) * conversion;
    const precioEspecialConverted = precio_especial
      ? (precioConverted - (precio_especial || 0) * conversion).toFixed(3)
      : "Sin precio especial";
    const precioDescuentoConverted = precio_descuento
      ? (precioConverted - (precio_descuento || 0) * conversion).toFixed(3)
      : "Sin precio descuento";

    return {
      precio: precioConverted.toFixed(3),
      precio_especial: precioEspecialConverted,
      precio_descuento: precioDescuentoConverted,
      siglas_moneda_conversion: item.siglas_moneda_conversion,
      estado_descuento: estado_descuento,
    };
  });

  return (
    <>
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
      <Accordion
        allowMultiple
        gridColumn={{ base: "1 / -1", md: "span 2" }}
        borderWidth="0"
        borderColor="brand.black_light"
      >
        <AccordionItem>
          <AccordionButton padding="0" margin={0}>
            <Box as="span" flex="1" textAlign="left">
              Conversión de monedas
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel
            padding="0"
            margin={0}
            mt={4}
            color="brand.gray_light"
          >
            {loading ? (
              <Skeleton
                height="80px"
                boxShadow="card"
                borderRadius="10px"
                startColor="brand.disabled"
                endColor="brand.gray3"
              />
            ) : (
              <Table columns={columnsRender} data={dataConvert} />
            )}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default Monedas;

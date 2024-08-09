import { Flex, Text } from "@chakra-ui/react";

export const columns = () => [
  {
    Header: "Precio Normal",
    accessor: (precio) => {
      return (
        <Flex>
          <Text textColor="brand.gray_light">
            {precio.precio}
            &nbsp;
          </Text>
          <Text textColor="brand.white">{precio.siglas_moneda_conversion}</Text>
        </Flex>
      );
    },
  },
  {
    Header: "Precio Especial (vendedores)",
    accessor: (precio) => {
      return (
        <Flex>
          <Text textColor="brand.gray_light">
            {precio.precio_especial}
            &nbsp;
          </Text>
          {precio.precio_especial !== "Sin precio especial" && (
            <Text textColor="brand.white">
              {precio.siglas_moneda_conversion}
            </Text>
          )}
        </Flex>
      );
    },
  },
  {
    Header: "Precio con Descuento",
    accessor: (precio) => {
      return (
        <Flex>
          <Text textColor="brand.gray_light">
            {precio.estado_descuento
              ? precio.precio_descuento
              : "Descuento Inactivo"}
            &nbsp;
          </Text>
          {precio.precio_descuento !== "Sin precio descuento" &&
            precio.estado_descuento && (
              <Text textColor="brand.white">
                {precio.siglas_moneda_conversion}
              </Text>
            )}
        </Flex>
      );
    },
  },
];

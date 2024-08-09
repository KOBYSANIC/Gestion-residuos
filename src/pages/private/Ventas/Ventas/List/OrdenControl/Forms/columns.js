import { Flex, Text } from "@chakra-ui/react";

export const columns = () => [
  {
    Header: "Precio en Dolares",
    accessor: (precio) => {
      return (
        <Flex>
          <Text textColor="brand.gray_light">
            {precio.precio_normal}
            &nbsp;
          </Text>
          <Text textColor="brand.white">{"USD"}</Text>
        </Flex>
      );
    },
  },
  {
    Header: "Precio Convertido",
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
];

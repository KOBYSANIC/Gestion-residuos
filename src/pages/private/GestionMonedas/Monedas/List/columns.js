import { Flex, Text } from "@chakra-ui/react";
import { TableButtonMoneda } from "../../../../../components/Buttons/TableButton";

export const columns = (onOpenEliminar, onOpenCreateUpdate) => [
  {
    Header: "Nombre",
    accessor: (row) => {
      return `${row?.siglas_moneda}/${row?.siglas_moneda_conversion}`;
    },
  },
  {
    Header: "Conversión",
    accessor: (row) => {
      return (
        <Flex fontWeight="bold">
          <Text textColor="brand.gray_light">{`${row?.dolar} ${row?.siglas_moneda}`}</Text>
          <Text textColor="brand.gray_light">&nbsp; = &nbsp;</Text>
          <Text textColor="brand.white">
            {`${row?.conversion} ${row?.siglas_moneda_conversion}`}
          </Text>
        </Flex>
      );
    },
  },
  {
    Header: "Acciones",
    accessor: "id",
    Cell: ({ row: { values } }) => (
      <TableButtonMoneda
        values={values}
        onOpenEliminar={onOpenEliminar}
        onOpenCreateUpdate={onOpenCreateUpdate}
      />
    ),
  },
];

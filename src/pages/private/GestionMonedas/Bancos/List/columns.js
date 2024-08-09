import { TableButtonBanco } from "../../../../../components/Buttons/TableButton";

import { Text } from "@chakra-ui/react";

export const columns = (onOpenEliminar, onOpenCreateUpdate) => [
  {
    Header: "Nombre",
    accessor: "nombre_banco",
    Cell: ({ value }) =>
      value || <Text color={"blue.500"}> No requerido </Text>,
  },
  {
    Header: "Número de cuenta",
    accessor: "numero_banco",
    Cell: ({ value }) =>
      value || <Text color={"blue.500"}> No requerido </Text>,
  },
  {
    Header: "DNI",
    accessor: "documento_identidad",
    Cell: ({ value }) =>
      value || <Text color={"blue.500"}> No requerido </Text>,
  },
  {
    Header: "Número de teléfono",
    accessor: "numero_teléfono",
    Cell: ({ value }) =>
      value || <Text color={"blue.500"}> No requerido </Text>,
  },
  {
    Header: "Tipo de banco",
    accessor: (values) => values?.tipo_banco?.label || "Sin Tipo de banco",
  },
  {
    Header: "Correo electrónico",
    accessor: "correo_electronico",
    Cell: ({ value }) =>
      value || <Text color={"blue.500"}> No requerido </Text>,
  },
  {
    Header: "Acciones",
    accessor: "id",
    Cell: ({ row: { values } }) => (
      <TableButtonBanco
        values={values}
        onOpenEliminar={onOpenEliminar}
        onOpenCreateUpdate={onOpenCreateUpdate}
      />
    ),
  },
];

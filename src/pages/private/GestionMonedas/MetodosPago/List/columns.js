import { TableButtonMetodosPago } from "../../../../../components/Buttons/TableButton";
import Badge from "../../../../../components/Badge/Badge";
import { Flex } from "@chakra-ui/react";

export const columns = (onOpenEliminar, onOpenCreateUpdate) => [
  {
    Header: "Pais",
    accessor: "pais.label",
  },
  {
    Header: "Bancos relacionadas",
    accessor: "cuenta",
    Cell: ({ row: { values } }) => {
      return (
        <Flex gap={2} maxW={"400px"} overflowX={"hidden"} wrap={"wrap"}>
          {values?.cuenta?.map((item, i) => (
            <Badge
              key={i}
              textContent={item?.metodo_pago?.nombre_banco}
              colorScheme={"blue"}
            />
          ))}
        </Flex>
      );
    },
  },
  {
    Header: "Mostrar en tienda",
    accessor: "mostrar_en_tienda.label",
  },
  {
    Header: "Acciones",
    accessor: "id",
    Cell: ({ row: { values } }) => (
      <TableButtonMetodosPago
        values={values}
        onOpenEliminar={onOpenEliminar}
        onOpenCreateUpdate={onOpenCreateUpdate}
      />
    ),
  },
];

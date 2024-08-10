import { Image } from "@chakra-ui/react";
import { TableButtonProducts } from "../../../../components/Buttons/TableButton";
import defaultImage from "../../../../assets/img/img/default_product.png";
import Badge from "../../../../components/Badge/Badge";
import { convertStatus } from "../../../../Utils/functions";
export const columns = (onOpenEliminar, onOpenCreateUpdate) => [
  {
    Header: "Fecha de recolección",
    accessor: "fecha_recoleccion",
  },
  {
    Header: "Ubicación",
    accessor: "ubicacion",
  },
  {
    Header: "Comentario",
    accessor: (value) =>
      value.comentario ? value.comentario : "Sin comentario",
  },
  {
    Header: "Estado de la recolección",
    accessor: "estado",
    Cell: ({ value }) => {
      return (
        <Badge
          textContent={convertStatus(value)?.name}
          colorScheme={convertStatus(value)?.color}
        />
      );
    },
  },
  {
    Header: "Acciones",
    accessor: "id",
    Cell: ({ row: { values } }) => (
      <TableButtonProducts
        values={values}
        onOpenEliminar={onOpenEliminar}
        onOpenCreateUpdate={onOpenCreateUpdate}
      />
    ),
  },
];

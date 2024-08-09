import { Image } from "@chakra-ui/react";
import { TableButtonProducts } from "../../../../components/Buttons/TableButton";
import defaultImage from "../../../../assets/img/img/default_product.png";
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

import { TableButtonMarca } from "../../../../../components/Buttons/TableButton";

export const columns = (onOpenEliminar, onOpenCreateUpdate) => [
  {
    Header: "Nombre",
    accessor: "nombre_marca",
  },
  {
    Header: "Descripción",
    accessor: "descripcion_marca",
  },
  {
    Header: "Acciones",
    accessor: "id",
    Cell: ({ row: { values } }) => (
      <TableButtonMarca
        values={values}
        onOpenEliminar={onOpenEliminar}
        onOpenCreateUpdate={onOpenCreateUpdate}
      />
    ),
  },
];

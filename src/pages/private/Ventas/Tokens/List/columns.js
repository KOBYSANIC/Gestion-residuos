import { TableButtonToken } from "../../../../../components/Buttons/TableButton";

export const columns = () => [
  {
    Header: "Nombre",
    accessor: "nombre_token",
  },
  {
    Header: "Acciones",
    accessor: "id",
    Cell: ({ row }) => <TableButtonToken />,
  },
];

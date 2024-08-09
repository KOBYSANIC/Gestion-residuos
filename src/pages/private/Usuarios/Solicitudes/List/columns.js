import { role_name } from "../../../../../Utils/constants";
import { TableButtonSolicitudUsuarios } from "../../../../../components/Buttons/TableButton";

export const columns = () => [
  {
    Header: "Nombre",
    accessor: "user_name",
  },
  {
    Header: "Correo",
    accessor: "email",
  },

  {
    Header: "Rol",
    accessor: "role",
    Cell: ({ value }) => role_name[value],
  },
  {
    Header: "Acciones",
    accessor: "id",
    Cell: ({ row }) => <TableButtonSolicitudUsuarios />,
  },
];

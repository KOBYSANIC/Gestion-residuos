import Badge from "../../../../../components/Badge/Badge";
import { TableButtonVenta } from "../../../../../components/Buttons/TableButton";
import { convertStatus } from "../../../../../Utils/functions";

export const columns = (onOpen, onOpen2, onOpen4, onOpen5, setIsView, setVentaID) => [
  {
    Header: "No. Orden",
    accessor: "numero_orden",
  },
  {
    Header: "Fecha orden generada",
    accessor: "created_at",
    Cell: ({ value }) => {
      try {
        const date = value.toDate();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const hour = date.getHours();
        const minutes = date.getMinutes();

        return `${day}/${month}/${year} ${hour}:${minutes}`;
      } catch (error) {
        return value;
      }
    },
  },
  {
    Header: "Estado de la orden",
    accessor: "status",
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
    Header: "Usuario",
    accessor: "usuario.email",
    Cell: ({ value }) => value || "Usuario no registrado",
  },
  {
    Header: "Método de pago",
    accessor: (row) => {
      return `${
        row.metodo_pago?.metodo_pago?.nombre_banco || "Sin método de pago"
      } | ${row.metodo_pago?.pais || "Sin país"}`;
    },
  },
  {
    Header: "Total",
    accessor: "totales.total",
    Cell: ({ value }) => `${value || "0.00"} USD`,
  },
  {
    Header: "Acciones",
    accessor: "id",
    Cell: ({ row }) => (
      <TableButtonVenta
        row={row}
        onOpen={onOpen}
        onOpen2={onOpen2}
        onOpen4={onOpen4}
        onOpen5={onOpen5}
        setIsView={setIsView}
        setVentaID={setVentaID}
      />
    ),
  },
];

import { Image } from "@chakra-ui/react";
import { TableButtonProducts } from "../../../../components/Buttons/TableButton";
import defaultImage from "../../../../assets/img/img/default_product.png";
export const columns = (onOpenEliminar, onOpenCreateUpdate) => [
  {
    Header: "",
    accessor: "imagen_miniatura",
    Cell: ({ value }) => {
      return (
        <Image
          borderRadius={10}
          src={value.length > 0 ? value[0] : defaultImage}
          alt="imagen"
          w="50px"
        />
      );
    },
  },
  {
    Header: "Nombre",
    accessor: "nombre_producto",
  },
  {
    Header: "Categoría",
    accessor: "categoria.nombre_categoria",
  },
  {
    Header: "Marca",
    accessor: "marca.nombre_marca",
  },
  {
    Header: "Cantidad Vendida",
    accessor: "cantidad_vendidos",
  },
  {
    Header: "Plataforma",
    accessor: "plataforma.nombre_plataforma",
  },
  {
    Header: "Mostrar en tienda",
    accessor: "mostrar_en_tienda.label",
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

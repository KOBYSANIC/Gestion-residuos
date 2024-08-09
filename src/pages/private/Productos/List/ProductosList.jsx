import React, { useEffect } from "react";

// components
import HeaderViewContent from "../../../../components/HeaderViewContent";
import Table from "../../../../components/Table";
import EliminarProducto from "../Eliminar/EliminarProducto";
import CrearActualizar from "../CrearActualizar";

// hooks
import useColumns from "../../../../hooks/useColumns";

// utils
import { columns } from "./columns";

// redux
import {
  getProductos,
  nextPage,
  prevPage,
  selectLoadingProductos,
  selectPage,
  selectProductos,
  setIsUpdate,
} from "../../../../redux/features/productoSlice";
import { useDispatch, useSelector } from "react-redux";

// chakra
import { useDisclosure } from "@chakra-ui/react";

const  ProductosList = () => {
  const dispatch = useDispatch();

  // modal eliminar
  const {
    isOpen: isOpenEliminar,
    onOpen: onOpenEliminar,
    onClose: onCloseEliminar,
  } = useDisclosure();

  // modal create update product
  const {
    isOpen: isOpenCreateUpdate,
    onOpen: onOpenCreateUpdate,
    onClose: onCloseCreateUpdate,
  } = useDisclosure();

  // columnas de la tabla
  const columnsRender = useColumns(columns(onOpenEliminar, onOpenCreateUpdate));

  // selectores de redux
  const loading = useSelector(selectLoadingProductos);
  const products = useSelector(selectProductos);
  const page = useSelector(selectPage);

  const nextPageTable = () => {
    dispatch(nextPage());
    dispatch(getProductos({ isNextPage: true, isPrevPage: false }));
  };

  const prevPageTable = () => {
    dispatch(prevPage());
    dispatch(getProductos({ isNextPage: false, isPrevPage: true }));
  };

  const onOpenCreate = () => {
    dispatch(setIsUpdate(false));
    onOpenCreateUpdate();
  };

  useEffect(() => {
    dispatch(getProductos({ isNextPage: false, isPrevPage: false }));
  }, [dispatch]);

  return (
    <>
      {/* modal create update product */}
      <CrearActualizar
        isOpen={isOpenCreateUpdate}
        onClose={onCloseCreateUpdate}
      />

      {/* modal eliminar */}
      <EliminarProducto isOpen={isOpenEliminar} onClose={onCloseEliminar} />

      <HeaderViewContent
        titleView="Residuos"
        textButton="Nuevo residuo"
        showSearchButton={false}
        showFilterButton={false}
        onOpen={onOpenCreate}
      />

      <Table
        columns={columnsRender}
        data={products}
        loading={loading}
        page={page}
        prevPageTable={prevPageTable}
        nextPageTable={nextPageTable}
        isSubModuleLoading
      />
    </>
  );
};

export default ProductosList;

import React, { useEffect, useState } from "react";

// components
import HeaderViewContent from "../../../../../components/HeaderViewContent";
import Table from "../../../../../components/Table";
import EliminarMetodoPago from "../Eliminar/EliminarMetodoPago";
import CrearActualizar from "../CrearActualizar";

// hooks
import useColumns from "../../../../../hooks/useColumns";

// utils
import { columns } from "./columns";

// redux
import {
  getMetodosPago,
  nextPage,
  prevPage,
  selectLoadingMetodosPago,
  selectPage,
  selectMetodosPago,
  setIsUpdate,
} from "../../../../../redux/features/metodosPagoSlice";
import { useDispatch, useSelector } from "react-redux";

// chakra
import { useDisclosure } from "@chakra-ui/react";

const MetodosPago = () => {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();

  // modal eliminar
  const {
    isOpen: isOpenEliminar,
    onOpen: onOpenEliminar,
    onClose: onCloseEliminar,
  } = useDisclosure();

  // modal create update
  const {
    isOpen: isOpenCreateUpdate,
    onOpen: onOpenCreateUpdate,
    onClose: onCloseCreateUpdate,
  } = useDisclosure();

  // columnas de la tabla
  const columnsRender = useColumns(columns(onOpenEliminar, onOpenCreateUpdate));

  // selectores de redux
  const loading = useSelector(selectLoadingMetodosPago);
  const metodosPagoData = useSelector(selectMetodosPago);
  const page = useSelector(selectPage);

  const nextPageTable = () => {
    dispatch(nextPage());
    dispatch(getMetodosPago({ isNextPage: true, isPrevPage: false }));
  };

  const prevPageTable = () => {
    dispatch(prevPage());
    dispatch(getMetodosPago({ isNextPage: false, isPrevPage: true }));
  };

  const onOpenCreate = () => {
    dispatch(setIsUpdate(false));
    onOpenCreateUpdate();
  };

  useEffect(() => {
    dispatch(getMetodosPago({ isNextPage: false, isPrevPage: false }));
  }, [dispatch]);

  return (
    <>
      {/* modal create update */}
      <CrearActualizar
        isOpen={isOpenCreateUpdate}
        onClose={onCloseCreateUpdate}
      />

      {/* modal eliminar */}
      <EliminarMetodoPago isOpen={isOpenEliminar} onClose={onCloseEliminar} />

      <HeaderViewContent
        titleView="Métodos de pago"
        textButton="Nuevo método"
        showFilterButton={false}
        onOpen={onOpenCreate}
        onKeyPress={(e) =>
          e.key === "Enter"
            ? dispatch(
                getMetodosPago({
                  search: search,
                  isNextPage: false,
                  isPrevPage: false,
                })
              )
            : null
        }
        onChange={(e) => setSearch(e.target.value)}
        searchTitle="Buscar por país"
      />

      <Table
        columns={columnsRender}
        data={metodosPagoData}
        loading={loading}
        page={page}
        prevPageTable={prevPageTable}
        nextPageTable={nextPageTable}
        isSubModuleLoading
      />
    </>
  );
};

export default MetodosPago;

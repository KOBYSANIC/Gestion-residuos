import React, { useEffect, useState } from "react";

// components
import HeaderViewContent from "../../../../../components/HeaderViewContent";
import Table from "../../../../../components/Table";
import EliminarMoneda from "../Eliminar/EliminarMoneda";
import CrearActualizar from "../CrearActualizar";

// hooks
import useColumns from "../../../../../hooks/useColumns";

// utils
import { columns } from "./columns";

// redux
import {
  getMonedas,
  nextPage,
  prevPage,
  selectLoadingMonedas,
  selectPage,
  selectMonedas,
  setIsUpdate,
} from "../../../../../redux/features/monedaSlice";
import { useDispatch, useSelector } from "react-redux";

// chakra
import { useDisclosure } from "@chakra-ui/react";

const MonedasList = () => {
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
  const loading = useSelector(selectLoadingMonedas);
  const monedasData = useSelector(selectMonedas);
  const page = useSelector(selectPage);

  const nextPageTable = () => {
    dispatch(nextPage());
    dispatch(getMonedas({ isNextPage: true, isPrevPage: false }));
  };

  const prevPageTable = () => {
    dispatch(prevPage());
    dispatch(getMonedas({ isNextPage: false, isPrevPage: true }));
  };

  const onOpenCreate = () => {
    dispatch(setIsUpdate(false));
    onOpenCreateUpdate();
  };

  useEffect(() => {
    dispatch(getMonedas({ isNextPage: false, isPrevPage: false }));
  }, [dispatch]);

  return (
    <>
      {/* modal update */}
      <CrearActualizar
        isOpen={isOpenCreateUpdate}
        onClose={onCloseCreateUpdate}
      />

      {/* modal eliminar */}
      <EliminarMoneda isOpen={isOpenEliminar} onClose={onCloseEliminar} />

      <HeaderViewContent
        titleView="Conversión de Monedas"
        textButton="Nueva Conversión"
        showFilterButton={false}
        onOpen={onOpenCreate}
        onKeyPress={(e) =>
          e.key === "Enter"
            ? dispatch(
                getMonedas({
                  search: search,
                  isNextPage: false,
                  isPrevPage: false,
                })
              )
            : null
        }
        onChange={(e) => setSearch(e.target.value)}
        searchTitle="Buscar por nombre moneda"
      />

      <Table
        columns={columnsRender}
        data={monedasData}
        loading={loading}
        page={page}
        prevPageTable={prevPageTable}
        nextPageTable={nextPageTable}
        isSubModuleLoading
      />
    </>
  );
};

export default MonedasList;

import React, { useEffect, useState } from "react";

// components
import HeaderViewContent from "../../../../../components/HeaderViewContent";
import Table from "../../../../../components/Table";
import EliminarMarca from "../Eliminar/EliminarMarca";
import CrearActualizar from "../CrearActualizar";

// hooks
import useColumns from "../../../../../hooks/useColumns";

// utils
import { columns } from "./columns";

// redux
import {
  getMarcas,
  nextPage,
  prevPage,
  selectLoadingMarcas,
  selectPage,
  selectMarcas,
  setIsUpdate,
} from "../../../../../redux/features/marcaSlice";
import { useDispatch, useSelector } from "react-redux";

// chakra
import { useDisclosure } from "@chakra-ui/react";

const MarcasList = () => {
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
  const loading = useSelector(selectLoadingMarcas);
  const marcasData = useSelector(selectMarcas);
  const page = useSelector(selectPage);

  const nextPageTable = () => {
    dispatch(nextPage());
    dispatch(getMarcas({ isNextPage: true, isPrevPage: false }));
  };

  const prevPageTable = () => {
    dispatch(prevPage());
    dispatch(getMarcas({ isNextPage: false, isPrevPage: true }));
  };

  const onOpenCreate = () => {
    dispatch(setIsUpdate(false));
    onOpenCreateUpdate();
  };

  useEffect(() => {
    dispatch(getMarcas({ isNextPage: false, isPrevPage: false }));
  }, [dispatch]);

  return (
    <>
      {/* modal create update */}
      <CrearActualizar
        isOpen={isOpenCreateUpdate}
        onClose={onCloseCreateUpdate}
      />

      {/* modal eliminar */}
      <EliminarMarca isOpen={isOpenEliminar} onClose={onCloseEliminar} />

      <HeaderViewContent
        titleView="Vehículos"
        textButton="Nueva vehículo"
        showFilterButton={false}
        onOpen={onOpenCreate}
        showSearchButton={false}
      />
      <Table
        columns={columnsRender}
        data={marcasData}
        loading={loading}
        page={page}
        prevPageTable={prevPageTable}
        nextPageTable={nextPageTable}
        isSubModuleLoading
      />
    </>
  );
};

export default MarcasList;

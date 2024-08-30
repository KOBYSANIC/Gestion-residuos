import React, { useEffect } from "react";
import Table from "../../../../components/Table";

// hooks
import useColumns from "../../../../hooks/useColumns";

// utils
import { columns } from "./columns";

// redux
import {
  generateExcel,
  getVentas,
  nextPage,
  prevPage,
  selectLoadingExcel,
  selectLoadingVentas,
  selectPage,
  selectVentas,
} from "../../../../redux/features/ventaSlice";
import { useDispatch, useSelector } from "react-redux";
import HeaderViewContent from "../../../../components/HeaderViewContent";

const ReportesList = () => {
  const dispatch = useDispatch();

  // columnas de la tabla
  const columnsRender = useColumns(columns());

  // selectores de redux
  const loading = useSelector(selectLoadingVentas);
  const ventasData = useSelector(selectVentas);
  const page = useSelector(selectPage);
  const loadingExcel = useSelector(selectLoadingExcel);

  const nextPageTable = () => {
    dispatch(nextPage());
    dispatch(getVentas({ isNextPage: true, isPrevPage: false }));
  };

  const prevPageTable = () => {
    dispatch(prevPage());
    dispatch(getVentas({ isNextPage: false, isPrevPage: true }));
  };

  useEffect(() => {
    dispatch(getVentas({ isNextPage: false, isPrevPage: false }));
  }, [dispatch]);

  return (
    <>
      <HeaderViewContent
        titleView="Reporte de recolecciones"
        showCreateButton={false}
        showSearchButton={false}
        showFilterButton={false}
        showExcelButton
        onClickExcel={() => dispatch(generateExcel({}))}
        loadingExcel={loadingExcel}
      />

      <Table
        columns={columnsRender}
        data={ventasData}
        loading={loading}
        page={page}
        prevPageTable={prevPageTable}
        nextPageTable={nextPageTable}
        isSubModuleLoading
      />
    </>
  );
};

export default ReportesList;

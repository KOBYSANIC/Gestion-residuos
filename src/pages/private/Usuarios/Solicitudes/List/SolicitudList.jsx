import React, { useEffect, useState } from "react";

// components
import HeaderViewContent from "../../../../../components/HeaderViewContent";
import Table from "../../../../../components/Table";

// hooks
import useColumns from "../../../../../hooks/useColumns";

// utils
import { columns } from "./columns";

// redux
import {
  getSolicitudes,
  nextPage,
  prevPage,
  selectLoadingsolicitudes,
  selectPage,
  selectSolicitudes,
} from "../../../../../redux/features/solicitudSlice";
import { useDispatch, useSelector } from "react-redux";

const SolicitudList = () => {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();

  // columnas de la tabla
  const columnsRender = useColumns(columns());

  // selectores de redux
  const loading = useSelector(selectLoadingsolicitudes);
  const solicitudData = useSelector(selectSolicitudes);
  const page = useSelector(selectPage);

  const nextPageTable = () => {
    dispatch(nextPage());
    dispatch(getSolicitudes({ isNextPage: true, isPrevPage: false }));
  };

  const prevPageTable = () => {
    dispatch(prevPage());
    dispatch(getSolicitudes({ isNextPage: false, isPrevPage: true }));
  };

  useEffect(() => {
    dispatch(getSolicitudes({ isNextPage: false, isPrevPage: false }));
  }, [dispatch]);

  return (
    <>
      <HeaderViewContent
        titleView="Solicitud de Usuarios"
        showFilterButton={false}
        showCreateButton={false}
        onKeyPress={(e) =>
          e.key === "Enter"
            ? dispatch(
                getSolicitudes({
                  search: search,
                  isNextPage: false,
                  isPrevPage: false,
                })
              )
            : null
        }
        onChange={(e) => setSearch(e.target.value)}
        searchTitle="Buscar por el correo"
      />

      <Table
        columns={columnsRender}
        data={solicitudData}
        loading={loading}
        page={page}
        prevPageTable={prevPageTable}
        nextPageTable={nextPageTable}
        isSubModuleLoading
      />
    </>
  );
};

export default SolicitudList;

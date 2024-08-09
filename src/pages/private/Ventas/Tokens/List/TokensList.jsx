import React, { useEffect } from "react";

// components
import HeaderViewContent from "../../../../../components/HeaderViewContent";
import Table from "../../../../../components/Table";

// hooks
import useColumns from "../../../../../hooks/useColumns";

// utils
import { columns } from "./columns";

// redux
import {
  getTokens,
  nextPage,
  prevPage,
  selectLoadingTokens,
  selectPage,
  selectTokens,
} from "../../../../../redux/features/tokenSlice";
import { useDispatch, useSelector } from "react-redux";

const TokensList = () => {
  const dispatch = useDispatch();

  // columnas de la tabla
  const columnsRender = useColumns(columns());

  // selectores de redux
  const loading = useSelector(selectLoadingTokens);
  const tokensData = useSelector(selectTokens);
  const page = useSelector(selectPage);

  const nextPageTable = () => {
    dispatch(nextPage());
    dispatch(getTokens({ isNextPage: true, isPrevPage: false }));
  };

  const prevPageTable = () => {
    dispatch(prevPage());
    dispatch(getTokens({ isNextPage: false, isPrevPage: true }));
  };

  useEffect(() => {
    dispatch(getTokens({ isNextPage: false, isPrevPage: false }));
  }, [dispatch]);

  return (
    <>
      <HeaderViewContent
        titleView="Tokens"
        showFilterButton={false}
        showCreateButton={false}
        showSearchButton={false}
      />

      <Table
        columns={columnsRender}
        data={tokensData}
        loading={loading}
        page={page}
        prevPageTable={prevPageTable}
        nextPageTable={nextPageTable}
        isSubModuleLoading
      />
    </>
  );
};

export default TokensList;

import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  nextPage,
  prevPage,
  getBrands,
  selectLoadingBrands,
  selectBrands,
  selectBrandSelected,
  setIsUpdate,
  selectPage,
  changeStateBrand,
} from "../../../../../redux/features/brandSlice";

import { useDisclosure } from "@chakra-ui/react";

import CreateUpdate from "../CreateUpdate/CreateUpdate";

import HeaderViewContent from "../../../../../components/HeaderViewContent";
import Table from "../../../../../components/Table";
// import { role_name } from "../../../../../Utils/constants";
import { TableButtonBrands } from "../../../../../components/Buttons/TableButton";
import ModalAlert from "../../../../../components/Modal/ModalAlert";

const BrandsList = () => {
  const [search, setSearch] = useState("");
  const columns = React.useMemo(
    () => [
      {
        Header: "Nombre",
        accessor: "brand_name",
      },
      {
        Header: "Descripción",
        accessor: "description",
      },

      {
        Header: "",
        accessor: "id",
        Cell: ({ row }) => (
          <TableButtonBrands
            row={row}
            onClick={onOpen2}
            onOpenModalUpdate={onOpen}
          />
        ),
      },
    ],
    []
  );

  // modal create update brand
  const { isOpen, onOpen, onClose } = useDisclosure();

  // modal alert
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();

  const loading = useSelector(selectLoadingBrands);
  const brandSelected = useSelector(selectBrandSelected);
  const brands = useSelector(selectBrands);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBrands({ isNextPage: false, isPrevPage: false }));
  }, [dispatch]);

  const handleOnContinue = () => {
    let new_state = { brand_id: brandSelected.id };

    dispatch(changeStateBrand(new_state));
  };

  const onOpenModal = (row) => {
    dispatch(setIsUpdate(false));
    onOpen();
  };

  // Pagination data
  const page = useSelector(selectPage);

  const nextPageTable = () => {
    dispatch(nextPage());
    dispatch(getBrands({ isNextPage: true, isPrevPage: false }));
  };

  const prevPageTable = () => {
    dispatch(prevPage());
    dispatch(getBrands({ isNextPage: false, isPrevPage: true }));
  };

  return (
    <>
      {/* Modal CreateUpdate */}
      <CreateUpdate isOpen={isOpen} onOpen={onOpen} onClose={onClose} />

      {/* Modal Alert (change brand status)*/}
      <ModalAlert
        subTitleText={`Estas por eliminar la marca ${brandSelected?.brand_name}`}
        description="Al eliminar la marca, ya no podras recuperarlo, "
        emphasisDescription="esta accion no se podrá revertir."
        isOpen={isOpen2}
        onClose={onClose2}
        onContinue={handleOnContinue}
      />

      {/* Filter, searcher and create button */}
      <HeaderViewContent
        titleView="Marcas"
        textButton="Nueva marca"
        showFilterButton={false}
        onOpen={onOpenModal}
        showSearchButton
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        onKeyPress={(e) =>
          e.key === "Enter"
            ? dispatch(
                getBrands({
                  search: search,
                  isNextPage: false,
                  isPrevPage: false,
                })
              )
            : null
        }
      />

      {/* Event table */}
      <Table
        columns={columns}
        data={brands}
        loading={loading}
        page={page}
        prevPageTable={prevPageTable}
        nextPageTable={nextPageTable}
        isSubModuleLoading
      />
    </>
  );
};

export default BrandsList;

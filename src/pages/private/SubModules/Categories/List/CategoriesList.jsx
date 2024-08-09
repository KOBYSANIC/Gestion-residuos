import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  nextPage,
  prevPage,
  getCategories,
  selectLoadingCategories,
  selectCategories,
  selectCategorySelected,
  setIsUpdate,
  selectPage,
  changeStateCategory,
} from "../../../../../redux/features/categorySlice";

import { useDisclosure } from "@chakra-ui/react";

import CreateUpdate from "../CreateUpdate/CreateUpdate";

import HeaderViewContent from "../../../../../components/HeaderViewContent";
import Table from "../../../../../components/Table";
// import { role_name } from "../../../../../Utils/constants";
import { TableButtonCategories } from "../../../../../components/Buttons/TableButton";
import ModalAlert from "../../../../../components/Modal/ModalAlert";

const CategoriesList = () => {
  const [search, setSearch] = useState("");
  const columns = React.useMemo(
    () => [
      {
        Header: "Nombre",
        accessor: "category_name",
      },
      {
        Header: "Descripción",
        accessor: "description",
      },

      {
        Header: "Mostrar en la tienda",
        accessor: "show_in_ecommerce",
        Cell: ({ value }) => (value ? "Si" : "No"),
      },
      {
        Header: "",
        accessor: "id",
        Cell: ({ row }) => (
          <TableButtonCategories
            row={row}
            onClick={onOpen2}
            onOpenModalUpdate={onOpen}
          />
        ),
      },
    ],
    []
  );

  // modal create update category
  const { isOpen, onOpen, onClose } = useDisclosure();

  // modal alert
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();

  const loading = useSelector(selectLoadingCategories);
  const categorySelected = useSelector(selectCategorySelected);
  const categories = useSelector(selectCategories);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCategories({ isNextPage: false, isPrevPage: false }));
  }, [dispatch]);

  const handleOnContinue = () => {
    let new_state = { category_id: categorySelected.id };
    dispatch(changeStateCategory(new_state));
  };

  const onOpenModal = (row) => {
    dispatch(setIsUpdate(false));
    onOpen();
  };

  // Pagination data
  const page = useSelector(selectPage);

  const nextPageTable = () => {
    dispatch(nextPage());
    dispatch(getCategories({ isNextPage: true, isPrevPage: false }));
  };

  const prevPageTable = () => {
    dispatch(prevPage());
    dispatch(getCategories({ isNextPage: false, isPrevPage: true }));
  };

  return (
    <>
      {/* Modal CreateUpdate */}
      <CreateUpdate isOpen={isOpen} onOpen={onOpen} onClose={onClose} />

      {/* Modal Alert (change category status)*/}
      <ModalAlert
        subTitleText={`Estas por eliminar la categoria ${categorySelected?.category_name}`}
        description="Al eliminar la marca, ya no podras recuperarlo, "
        emphasisDescription="esta accion no se podrá revertir."
        isOpen={isOpen2}
        onClose={onClose2}
        onContinue={handleOnContinue}
      />

      {/* Filter, searcher and create button */}
      <HeaderViewContent
        titleView="Categorías"
        textButton="Nueva categoría"
        showSearchButton
        showFilterButton={false}
        onOpen={onOpenModal}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        onKeyPress={(e) =>
          e.key === "Enter"
            ? dispatch(
                getCategories({
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
        data={categories}
        loading={loading}
        page={page}
        prevPageTable={prevPageTable}
        nextPageTable={nextPageTable}
        isSubModuleLoading
      />
    </>
  );
};

export default CategoriesList;

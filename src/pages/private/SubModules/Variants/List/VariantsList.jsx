import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  nextPage,
  prevPage,
  getVariants,
  selectLoadingVariants,
  selectVariants,
  selectVariantSelected,
  setIsUpdate,
  selectPage,
  changeStateVariant,
} from "../../../../../redux/features/variantSlice";

import { useDisclosure } from "@chakra-ui/react";

import CreateUpdate from "../CreateUpdate/CreateUpdate";

import HeaderViewContent from "../../../../../components/HeaderViewContent";
import Table from "../../../../../components/Table";
// import { role_name } from "../../../../../Utils/constants";
import { TableButtonVariants } from "../../../../../components/Buttons/TableButton";
import ModalAlert from "../../../../../components/Modal/ModalAlert";

const VariantsList = () => {
  const columns = React.useMemo(
    () => [
      {
        Header: "Nombre",
        accessor: "variant_name",
      },
      {
        Header: "Título",
        accessor: "title",
      },
      {
        Header: "Descripción",
        accessor: "description",
      },
      {
        Header: "",
        accessor: "id",
        Cell: ({ row }) => (
          <TableButtonVariants
            row={row}
            onClick={onOpen2}
            onOpenModalUpdate={onOpen}
          />
        ),
      },
    ],
    []
  );

  // modal create update variant
  const { isOpen, onOpen, onClose } = useDisclosure();

  // modal alert
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();

  const loading = useSelector(selectLoadingVariants);
  const variantSelected = useSelector(selectVariantSelected);
  const variants = useSelector(selectVariants);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getVariants({ isNextPage: false, isPrevPage: false }));
  }, [dispatch]);

  const handleOnContinue = () => {
    let new_state = { variant_id: variantSelected.id };

    dispatch(changeStateVariant(new_state));
  };

  const onOpenModal = (row) => {
    dispatch(setIsUpdate(false));
    onOpen();
  };

  // Pagination data
  const page = useSelector(selectPage);

  const nextPageTable = () => {
    dispatch(nextPage());
    dispatch(getVariants({ isNextPage: true, isPrevPage: false }));
  };

  const prevPageTable = () => {
    dispatch(prevPage());
    dispatch(getVariants({ isNextPage: false, isPrevPage: true }));
  };

  return (
    <>
      {/* Modal CreateUpdate */}
      <CreateUpdate isOpen={isOpen} onOpen={onOpen} onClose={onClose} />

      {/* Modal Alert (change variant status)*/}
      <ModalAlert
        subTitleText={`Estas por eliminar la variación ${variantSelected?.variant_name}`}
        description="Al eliminar la marca, ya no podras recuperarlo, "
        emphasisDescription="esta accion no se podrá revertir."
        isOpen={isOpen2}
        onClose={onClose2}
        onContinue={handleOnContinue}
      />

      {/* Filter, searcher and create button */}
      <HeaderViewContent
        titleView="Variaciones"
        textButton="Nueva Variación"
        showSearchButton={false}
        showFilterButton={false}
        onOpen={onOpenModal}
      />

      {/* Event table */}
      <Table
        columns={columns}
        data={variants}
        loading={loading}
        page={page}
        prevPageTable={prevPageTable}
        nextPageTable={nextPageTable}
        isSubModuleLoading
      />
    </>
  );
};

export default VariantsList;

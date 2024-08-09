import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  nextPage,
  prevPage,
  getProducts,
  selectLoadingProducts,
  selectProducts,
  selectProductSelected,
  setIsUpdate,
  selectPage,
  changeStateProduct,
} from "../../../../redux/features/productSlice";

import { Image, useDisclosure } from "@chakra-ui/react";

import CreateUpdate from "../CreateUpdate/CreateUpdate";

import HeaderViewContent from "../../../../components/HeaderViewContent";
import Table from "../../../../components/Table";
import { TableButtonProducts } from "../../../../components/Buttons/TableButton";
import ModalAlert from "../../../../components/Modal/ModalAlert";
import { formatCurrency } from "../../../../Utils/currency";

import defaultImage from "../../../../assets/img/img/default_product.png";
import Discount from "../Discount";

const ProductList = () => {
  const [search, setSearch] = useState("");
  // modal alert
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();

  const columns = React.useMemo(
    () => [
      {
        Header: "",
        accessor: "images",
        Cell: ({ value }) => {
          return (
            <Image
              src={value.length > 0 ? value[0] : defaultImage}
              alt="imagen"
              w="90px"
            />
          );
        },
      },
      {
        Header: "Nombre",
        accessor: "product_name",
      },
      {
        Header: "Código",
        accessor: "product_code",
      },
      {
        Header: "Marca",
        accessor: "brands",
        Cell: ({ value }) => {
          if (Array.isArray(value)) {
            return value.length > 0 ? value[0].brand_name : "---";
          }
          return "---";
        },
      },
      {
        Header: "Categoría",
        accessor: "categories",
        Cell: ({ value }) => {
          if (Array.isArray(value)) {
            return value.length > 0 ? value[0].category_name : "---";
          }
          return "---";
        },
      },
      {
        Header: "Mostrar en la tienda",
        accessor: "show_in_ecommerce",
        Cell: ({ value }) => (value ? "Si" : "No"),
      },
      {
        Header: "Precio",
        accessor: "price",
        Cell: ({ value }) => formatCurrency(value?.value || 0),
      },

      {
        Header: "",
        accessor: "id",
        Cell: ({ row }) => (
          <TableButtonProducts
            row={row}
            onClick={onOpen2}
            onOpenModalUpdate={onOpen}
            onOpenModalDiscount={onOpenDiscount}
          />
        ),
      },
    ],
    []
  );

  // modal create update product
  const { isOpen, onOpen, onClose } = useDisclosure();

  // modal discount
  const {
    isOpen: isOpenDiscount,
    onOpen: onOpenDiscount,
    onClose: onCloseDiscount,
  } = useDisclosure();

  const loading = useSelector(selectLoadingProducts);
  const productSelected = useSelector(selectProductSelected);
  const products = useSelector(selectProducts);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProducts({ isNextPage: false, isPrevPage: false }));
  }, [dispatch]);

  const handleOnContinue = () => {
    let new_state = { product_id: productSelected.id };
    dispatch(changeStateProduct(new_state));
  };

  const onOpenModal = (row) => {
    dispatch(setIsUpdate(false));
    onOpen();
  };

  // Pagination data
  const page = useSelector(selectPage);

  const nextPageTable = () => {
    dispatch(nextPage());
    dispatch(getProducts({ isNextPage: true, isPrevPage: false }));
  };

  const prevPageTable = () => {
    dispatch(prevPage());
    dispatch(getProducts({ isNextPage: false, isPrevPage: true }));
  };

  return (
    <>
      {/* Modal CreateUpdate */}
      <CreateUpdate isOpen={isOpen} onOpen={onOpen} onClose={onClose} />

      <Discount
        isOpen={isOpenDiscount}
        onOpen={onOpenDiscount}
        onClose={onCloseDiscount}
      />

      {/* Modal Alert (change product status)*/}
      <ModalAlert
        subTitleText={`Estas por eliminar la producto ${productSelected?.product_name}`}
        description="Al eliminar la marca, ya no podras recuperarlo, "
        emphasisDescription="esta accion no se podrá revertir."
        isOpen={isOpen2}
        onClose={onClose2}
        onContinue={handleOnContinue}
      />

      {/* Filter, searcher and create button */}
      <HeaderViewContent
        titleView="Productos"
        textButton="Nuevo producto"
        onOpen={onOpenModal}
        showFilterButton={false}
        showSearchButton
        onKeyPress={(e) =>
          e.key === "Enter"
            ? dispatch(
                getProducts({
                  search: search,
                  isNextPage: false,
                  isPrevPage: false,
                })
              )
            : null
        }
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Event table */}
      <Table
        columns={columns}
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

export default ProductList;

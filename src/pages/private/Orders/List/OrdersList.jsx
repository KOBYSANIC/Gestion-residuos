import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  nextPage,
  prevPage,
  getOrders,
  selectLoadingOrders,
  selectOrders,
  selectOrderSelected,
  setIsUpdate,
  selectPage,
  changeStateOrder,
} from "../../../../redux/features/orderSlice";

import { useDisclosure } from "@chakra-ui/react";

import CreateUpdate from "../CreateUpdate/CreateUpdate";

import HeaderViewContent from "../../../../components/HeaderViewContent";
import Table from "../../../../components/Table";
// import { role_name } from "../../../../../Utils/constants";
import { TableButtonOrders } from "../../../../components/Buttons/TableButton";
import ModalAlert from "../../../../components/Modal/ModalAlert";
import { formatCurrency } from "../../../../Utils/currency";
import BadgeStateOrder from "../../../../components/Badge/BadgeStateOrder";
import {
  CANCELADO,
  ENTREGADO,
  ENVIADO,
  GENERADO,
} from "../../../../Utils/constants";
import ModalFilter from "./ModalFilter";

const OrdersList = () => {
  const columns = React.useMemo(
    () => [
      {
        Header: "No. Orden",
        accessor: (d) => {
          return d.no_order || "Sin numero de orden";
        },
      },
      {
        Header: "Estado",
        accessor: "order_state",
        Cell: ({ value }) => <BadgeStateOrder state_order={value || "1"} />,
      },
      {
        Header: "Cliente",
        accessor: (d) => {
          const name = d?.customerData?.name || "Sin Cliente";
          const telephone = d?.customerData?.telephone || "Sin No. Teléfono";
          const name_telephone = `${name} | ${telephone}`;
          return name_telephone;
        },
      },
      {
        Header: "Fecha orden generada",
        accessor: "created_at",
        Cell: ({ value }) => {
          const date = value.toDate();
          const day = date.getDate();
          const month = date.getMonth() + 1;
          const year = date.getFullYear();

          return `${day}/${month}/${year}`;
        },
      },
      {
        Header: "Total",
        accessor: (d) => {
          return d.deliveryMethod === 2
            ? formatCurrency(d.total + 35 || 0)
            : formatCurrency(d.total || 0);
        },
      },
      {
        Header: "",
        accessor: "id",
        Cell: ({ row }) => (
          <TableButtonOrders
            row={row}
            onClick={onOpen2}
            onOpenModalUpdate={onOpen}
          />
        ),
      },
    ],
    []
  );

  // modal create update order
  const { isOpen, onOpen, onClose } = useDisclosure();

  // modal alert
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();

  const {
    isOpen: isOpen3,
    onOpen: onOpen3,
    onClose: onClose3,
  } = useDisclosure();

  const loading = useSelector(selectLoadingOrders);
  const orderSelected = useSelector(selectOrderSelected);
  const orders = useSelector(selectOrders);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrders({ isNextPage: false, isPrevPage: false }));
  }, [dispatch]);

  const isCancelOrder = orderSelected && orderSelected.isCancell;
  const isInSendOrder = orderSelected && orderSelected.order_state === GENERADO;
  const isInDeliveredOrder =
    orderSelected && orderSelected.order_state === ENVIADO;

  const subTitleTextModalALert = isCancelOrder
    ? `Estas por cancelar la orden ${orderSelected.no_order}`
    : `Estas por modificar el estado de la orden ${
        isInSendOrder ? "a enviado" : "a entregado"
      }`;

  const descriptionModalALert = isCancelOrder
    ? "Al cancelar la orden, ya no podras modificarlo, "
    : "Al modificar el estado de la orden, se pasara a la siguiente etapa, ";

  const handleOnContinue = () => {
    let new_state = { order_id: orderSelected.id };

    if (isCancelOrder) new_state = { ...new_state, state: CANCELADO };
    else if (isInSendOrder) new_state = { ...new_state, state: ENVIADO };
    else if (isInDeliveredOrder) new_state = { ...new_state, state: ENTREGADO };
    dispatch(changeStateOrder(new_state));
  };

  // Pagination data
  const page = useSelector(selectPage);

  const nextPageTable = () => {
    dispatch(nextPage());
    dispatch(getOrders({ isNextPage: true, isPrevPage: false }));
  };

  const prevPageTable = () => {
    dispatch(prevPage());
    dispatch(getOrders({ isNextPage: false, isPrevPage: true }));
  };

  return (
    <>
      {/* Modal CreateUpdate */}
      <CreateUpdate isOpen={isOpen} onOpen={onOpen} onClose={onClose} />

      {/* Modal Filter */}
      <ModalFilter isOpen={isOpen3} onClose={onClose3} />

      {/* Modal Alert (change order status)*/}
      <ModalAlert
        subTitleText={subTitleTextModalALert}
        description={descriptionModalALert}
        emphasisDescription="esta accion no se podrá revertir."
        isOpen={isOpen2}
        onClose={onClose2}
        onContinue={handleOnContinue}
      />

      {/* Filter, searcher and create button */}
      <HeaderViewContent
        titleView="Ordenes"
        showCreateButton={false}
        showSearchButton={false}
        onOpenFilers={onOpen3}
      />

      {/* Event table */}
      <Table
        columns={columns}
        data={orders}
        loading={loading}
        page={page}
        prevPageTable={prevPageTable}
        nextPageTable={nextPageTable}
        isSubModuleLoading
      />
    </>
  );
};

export default OrdersList;

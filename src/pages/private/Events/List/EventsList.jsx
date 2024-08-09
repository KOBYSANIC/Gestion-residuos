import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  changeStateEvent,
  getEvents,
  nextPage,
  prevPage,
  selecteEventSelected,
  selectEvent,
  selectPage,
  setIsUpdate,
} from "../../../../redux/features/eventSlice";

import { useDisclosure } from "@chakra-ui/react";

import CreateUpdate from "../CreateUpdate/CreateUpdate";

import HeaderViewContent from "../../../../components/HeaderViewContent";
import Table from "../../../../components/Table";
import {
  CANCELADO,
  EN_RUTA,
  FINALIZADO,
  PROCESO,
} from "../../../../Utils/constants";
import { TableButtonEvents } from "../../../../components/Buttons/TableButton";
import ModalAlert from "../../../../components/Modal/ModalAlert";
import ModalFilter from "./ModalFilter";
import BadgeStateEvent from "../../../../components/Badge/BadgeStateEvent";

const EventsList = () => {
  const columns = React.useMemo(
    () => [
      {
        Header: "Nombre del evento",
        accessor: "event_name", // accessor is the "key" in the data
      },
      {
        Header: "Estado",
        accessor: "event_state",
        Cell: ({ value }) => <BadgeStateEvent state_event={value} />,
      },
      {
        Header: "Fecha",
        accessor: "event_date",
        Cell: ({ value }) => {
          const date = value.toDate();
          const day = date.getDate();
          const month = date.getMonth() + 1;
          const year = date.getFullYear();
          const formattedDate = date.toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });

          return `${day}/${month}/${year} ${formattedDate}`;
        },
      },
      {
        Header: "",
        accessor: "id",
        Cell: ({ row }) => (
          <TableButtonEvents
            row={row}
            onClick={onOpen2}
            onOpenModalUpdate={onOpen}
          />
        ),
      },
    ],
    []
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
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

  const events = useSelector(selectEvent);
  const loading = useSelector((state) => state.event.loading);

  const dispatch = useDispatch();

  const eventSelected = useSelector(selecteEventSelected);

  useEffect(() => {
    dispatch(getEvents({ isNextPage: false, isPrevPage: false }));
  }, [dispatch]);

  const isCancelEvent = eventSelected && eventSelected.isCancell;
  const isInProcesEvent =
    eventSelected && eventSelected.event_state === PROCESO;
  const isInRouteEvent = eventSelected && eventSelected.event_state === EN_RUTA;

  const subTitleTextModalALert = isCancelEvent
    ? `Estas por cancelar el evento ${eventSelected.event_name}`
    : `Estas por modificar el estado del evento ${
        isInProcesEvent ? "a en ruta" : "a finalizado"
      }`;

  const descriptionModalALert = isCancelEvent
    ? "Al cancelar el evento, ya no podras modificarlo, "
    : "Al modificar el estado del evento, se pasara a la siguiente etapa, ";

  const handleOnContinue = () => {
    let new_state = { event_id: eventSelected.id };

    if (isCancelEvent) new_state = { ...new_state, state: CANCELADO };
    else if (isInProcesEvent) new_state = { ...new_state, state: EN_RUTA };
    else if (isInRouteEvent) new_state = { ...new_state, state: FINALIZADO };

    dispatch(changeStateEvent(new_state));
  };

  const onOpenModal = (row) => {
    dispatch(setIsUpdate(false));
    onOpen();
  };

  // Pagination data
  const page = useSelector(selectPage);

  const nextPageTable = () => {
    dispatch(nextPage());
    dispatch(getEvents({ isNextPage: true, isPrevPage: false }));
  };

  const prevPageTable = () => {
    dispatch(prevPage());
    dispatch(getEvents({ isNextPage: false, isPrevPage: true }));
  };

  return (
    <>
      {/* Modal CreateUpdate */}
      <CreateUpdate isOpen={isOpen} onOpen={onOpen} onClose={onClose} />

      {/* Modal Filter */}
      <ModalFilter isOpen={isOpen3} onClose={onClose3} />

      {/* Modal Alert (change event status)*/}
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
        titleView="Eventos"
        textButton="Nuevo evento"
        showSearchButton={false}
        onOpen={onOpenModal}
        onOpenFilers={onOpen3}
      />

      {/* Event table */}
      <Table
        columns={columns}
        data={events}
        loading={loading}
        page={page}
        prevPageTable={prevPageTable}
        nextPageTable={nextPageTable}
      />
    </>
  );
};

export default EventsList;

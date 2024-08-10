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
  changeState,
  getVentas,
  nextPage,
  prevPage,
  selectLoadingVentas,
  selectPage,
  selectVentas,
} from "../../../../../redux/features/ventaSlice";
import { useDispatch, useSelector } from "react-redux";
import ModalFilter from "./ModalFilter/ModalFilter";
import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import ModalAlert from "../../../../../components/Modal/ModalAlert";
import {
  CANCELADO_ORDER,
  CANCELADO_RESIDUO,
  FINALIZADO_RESIDUO,
  NO_RECOLECTADO_RESIDUO,
  REEMBOLSO_REALIZADO,
  error_order,
  user_role,
} from "../../../../../Utils/constants";
import InputFormValidation from "../../../../../components/Inputs/InputFormValidation/InputFormValidation";
import { useForm } from "react-hook-form";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import OrdenControl from "./OrdenControl/OrdenControl";
import InputSelect from "../../../../../components/Inputs/InputSelect";

const VentasList = () => {
  const dispatch = useDispatch();

  const [ventaID, setVentaID] = useState(null);

  // estados
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  // modal filter
  const { isOpen, onOpen, onClose } = useDisclosure();
  // modal alert
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();
  // modal view
  const {
    isOpen: isOpen3,
    onOpen: onOpen3,
    onClose: onClose3,
  } = useDisclosure();

  // modal view
  const {
    isOpen: isOpen4,
    onOpen: onOpen4,
    onClose: onClose4,
  } = useDisclosure();

  // modal view
  const {
    isOpen: isOpen5,
    onOpen: onOpen5,
    onClose: onClose5,
  } = useDisclosure();

  const [isView, setIsView] = useState(false);

  // columnas de la tabla
  const columnsRender = useColumns(
    columns(onOpen2, onOpen3, onOpen4, onOpen5, setIsView, setVentaID)
  );

  // selectores de redux
  const loading = useSelector(selectLoadingVentas);
  const ventasData = useSelector(selectVentas);
  const page = useSelector(selectPage);

  const nextPageTable = () => {
    dispatch(nextPage());
    dispatch(
      getVentas({ isNextPage: true, isPrevPage: false, search, filter })
    );
  };

  const onSubmit = () => {
    const new_state = {
      id: ventaID,
      status: CANCELADO_RESIDUO,
    };
    dispatch(changeState(new_state));
    onClose2();
  };

  const onSubmitError = (data) => {
    const new_state = {
      id: ventaID,
      status: NO_RECOLECTADO_RESIDUO,
    };

    dispatch(changeState(new_state));
    onClose4();
  };

  const onSubmitReembolso = () => {
    const new_state = {
      id: ventaID,
      status: FINALIZADO_RESIDUO,
    };

    dispatch(changeState(new_state));
    onClose5();
  };

  const prevPageTable = () => {
    dispatch(prevPage());
    dispatch(
      getVentas({ isNextPage: false, isPrevPage: true, search, filter })
    );
  };

  useEffect(() => {
    dispatch(getVentas({ isNextPage: false, isPrevPage: false }));
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  return (
    <>
      <ModalFilter
        isOpen={isOpen}
        onClose={onClose}
        search={search}
        setFilter={setFilter}
      />

      <ModalAlert
        subTitleText={"Estas por cancelar la recolección"}
        description={"Al cancelar la recolección, ya no podras modificarlo, "}
        emphasisDescription="esta accion no se podrá revertir."
        isOpen={isOpen2}
        onClose={onClose2}
        onContinue={() => {}}
        onSubmit={handleSubmit(onSubmit)}
      />

      <ModalAlert
        subTitleText={"Estas por marcar como no recolectado"}
        description={"Al marcar este estado, ya no podras modificarlo, "}
        emphasisDescription="esta accion no se podrá revertir."
        isOpen={isOpen4}
        onClose={onClose4}
        onContinue={() => {}}
        onSubmit={handleSubmit(onSubmitError)}
      />

      <ModalAlert
        subTitleText={"Estas por finalizar la recolección"}
        description={"Al finalizar la recolección, ya no podras modificarlo, "}
        emphasisDescription="esta accion no se podrá revertir."
        isOpen={isOpen5}
        onClose={onClose5}
        onContinue={() => {}}
        onSubmit={handleSubmit(onSubmitReembolso)}
      />

      <OrdenControl isOpen={isOpen3} onClose={onClose3} isView={isView} />

      <HeaderViewContent
        titleView="Recolecciones"
        showCreateButton={false}
        showSearchButton={false}
        onOpenFilers={onOpen}
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

export default VentasList;

import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  nextPage,
  prevPage,
  getUsers,
  selectLoadingUsers,
  selectUsers,
  selectUserSelected,
  setIsUpdate,
  selectPage,
  changeStateUser,
} from "../../../../../redux/features/userSlice";

import { useDisclosure } from "@chakra-ui/react";

import CreateUpdate from "../CreateUpdate/CreateUpdate";

import HeaderViewContent from "../../../../../components/HeaderViewContent";
import Table from "../../../../../components/Table";
import { role_name } from "../../../../../Utils/constants";
import { TableButtonUsers } from "../../../../../components/Buttons/TableButton";
import ModalAlert from "../../../../../components/Modal/ModalAlert";
import Badge from "../../../../../components/Badge/Badge";

const UsersList = () => {
  const columns = React.useMemo(
    () => [
      {
        Header: "Nombre",
        accessor: "user_name",
      },
      {
        Header: "Correo",
        accessor: "email",
      },
      {
        Header: "Proveedor",
        accessor: "typed",
      },
      {
        Header: "Rol",
        accessor: "role",
        Cell: ({ value }) => role_name[value],
      },

      {
        Header: "Fecha de creación",
        accessor: "created_at",
        Cell: ({ value }) =>
          value?.toDate()?.toLocaleDateString() || "No disponible",
      },

      {
        Header: "Estado",
        accessor: "active",
        Cell: ({ value }) => {
          return (
            <Badge
              textContent={value ? "Activo" : "Inactivo"}
              colorScheme={value ? "blue" : "red"}
            />
          );
        },
      },
      {
        Header: "",
        accessor: "id",
        Cell: ({ row }) => (
          <TableButtonUsers
            row={row}
            onClick={onOpen2}
            onOpenModalUpdate={onOpen}
            active={row?.values?.active}
          />
        ),
      },
    ],
    []
  );

  // modal create update user
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");

  // modal alert
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();

  const loading = useSelector(selectLoadingUsers);
  const userSelected = useSelector(selectUserSelected);
  const users = useSelector(selectUsers);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers({ isNextPage: false, isPrevPage: false }));
  }, [dispatch]);

  const handleOnContinue = () => {
    let new_state = { user_id: userSelected.id };
    dispatch(changeStateUser(new_state));
  };

  const onOpenModal = (row) => {
    dispatch(setIsUpdate(false));
    onOpen();
  };

  // Pagination data
  const page = useSelector(selectPage);

  const nextPageTable = () => {
    dispatch(nextPage());
    dispatch(getUsers({ isNextPage: true, isPrevPage: false }));
  };

  const prevPageTable = () => {
    dispatch(prevPage());
    dispatch(getUsers({ isNextPage: false, isPrevPage: true }));
  };

  return (
    <>
      {/* Modal CreateUpdate */}
      <CreateUpdate isOpen={isOpen} onOpen={onOpen} onClose={onClose} />

      {/* Modal Alert (change user status)*/}
      <ModalAlert
        subTitleText={`Estas por inactivar el usuario ${userSelected?.user_name}.`}
        description="Al inactivar el usuario, este no podra acceder al sistema. "
        emphasisDescription="¿Estas seguro de inactivar el usuario?"
        isOpen={isOpen2}
        onClose={onClose2}
        onContinue={handleOnContinue}
      />

      {/* Filter, searcher and create button */}
      <HeaderViewContent
        titleView="Usuarios"
        textButton="Nuevo usuario"
        showFilterButton={false}
        onOpen={onOpenModal}
        onKeyPress={(e) =>
          e.key === "Enter"
            ? dispatch(
                getUsers({
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

      {/* Event table */}
      <Table
        columns={columns}
        data={users}
        loading={loading}
        page={page}
        prevPageTable={prevPageTable}
        nextPageTable={nextPageTable}
      />
    </>
  );
};

export default UsersList;

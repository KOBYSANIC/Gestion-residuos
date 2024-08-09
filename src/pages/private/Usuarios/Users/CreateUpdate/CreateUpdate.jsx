import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useDispatch, useSelector } from "react-redux";

import ModalForm from "../../../../../components/Modal/ModalForm";
import UsersForm from "./UsersForm";
import { Skeleton } from "@chakra-ui/react";
import {
  createUser,
  selectIsUpdate,
  selectLoadingSaveUser,
  selectLoadingUpdateUser,
  selectUserDataUpdate,
  updateUser,
} from "../../../../../redux/features/userSlice";
import toast from "react-hot-toast";

const CreateUpdate = ({ isOpen, onClose }) => {
  const userSelected = useSelector(selectUserDataUpdate);
  const loading = useSelector(selectLoadingUpdateUser);
  const isUpdate = useSelector(selectIsUpdate);
  const dispatch = useDispatch();
  const modalTitle = isUpdate ? "Editar usuario" : "Nuevo usuario";
  const buttonTitle = isUpdate ? "Actualizar usuario" : "Agregar usuario";

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const loading_save = useSelector(selectLoadingSaveUser);

  const onSubmit = (data) => {
    if (isUpdate) {
      if (data?.typed === "google" && data?.user_role?.value == "1") {
        toast.error(
          "No puedes asignar el rol de administrador a un usuario de con el proveedor de google"
        );
        return;
      }
      dispatch(updateUser({ ...data, onClose, reset }));
    } else {
      dispatch(createUser({ ...data, onClose, reset }));
    }
  };

  useEffect(() => {
    if (isUpdate) {
      reset(userSelected);
    } else {
      reset({});
    }
  }, [isUpdate, userSelected]);

  return (
    <>
      <ModalForm
        titleModal={modalTitle}
        isOpen={isOpen}
        onClose={onClose}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        textButtonClose="Cancelar"
        textButtonSubmit={buttonTitle}
        loadingButtonSubmit={loading_save}
      >
        {loading ? (
          <>
            <Skeleton
              height="80px"
              boxShadow="card"
              borderRadius="10px"
              startColor="brand.disabled"
              endColor="brand.gray3"
            />
            <Skeleton
              height="80px"
              boxShadow="card"
              borderRadius="10px"
              startColor="brand.disabled"
              endColor="brand.gray3"
            />
            <Skeleton
              height="80px"
              boxShadow="card"
              borderRadius="10px"
              startColor="brand.disabled"
              endColor="brand.gray3"
            />
            <Skeleton
              height="80px"
              boxShadow="card"
              borderRadius="10px"
              startColor="brand.disabled"
              endColor="brand.gray3"
            />
          </>
        ) : (
          <UsersForm
            errors={errors}
            register={register}
            control={control}
            isUpdate={isUpdate}
          />
        )}
      </ModalForm>
    </>
  );
};

export default CreateUpdate;

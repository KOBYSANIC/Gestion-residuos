import React, { useEffect } from "react";

// react-hook-form
import { useForm } from "react-hook-form";

// redux
import { useDispatch, useSelector } from "react-redux";
import {
  createProducto,
  loadingActions,
  selectIsUpdate,
  selectProductoDataUpdate,
  updateProducto,
} from "../../../../redux/features/productoSlice";

// components
import ModalFormMultiStep from "../../../../components/Modal/ModalFormMultiStep";
import ProductoForm from "./ProductoForm";
import PreciosForm from "./PreciosForm";
import DatosCompraForm from "./DatosCompraForm";

const steps = [
  { label: "Datos Generales" },
  { label: "Control de Precios" },
  { label: "Datos de Compra" },
];

const CrearActualizar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  // selectores de redux
  const productoSelected = useSelector(selectProductoDataUpdate);
  const loading = useSelector(loadingActions);
  const isUpdate = useSelector(selectIsUpdate);
  const modalTitle = isUpdate ? "Editar Producto" : "Nuevo Producto";
  const buttonTitle = isUpdate ? "Actualizar Producto" : "Agregar Producto";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm();

  const loading_save = useSelector(loadingActions);

  const onSubmit = (data) => {
    data.tags = data.tags ? data.tags.map((item) => item.value) : [];

    data.datos_compra = data.datos_compra.map((item) => {
      return {
        ...item,
        name_input: item.name_input.toLowerCase().replace(/ /g, "_"),
      };
    });

    if (isUpdate) {
      dispatch(updateProducto({ ...data, onClose, reset }));
    } else {
      dispatch(createProducto({ ...data, onClose, reset }));
    }
  };

  useEffect(() => {
    if (isUpdate) {
      reset(productoSelected);
    } else {
      reset({});
    }
  }, [isUpdate, productoSelected]);

  const forms = [
    <ProductoForm errors={errors} register={register} control={control} />,
    <PreciosForm
      errors={errors}
      register={register}
      watch={watch}
      control={control}
    />,
    <DatosCompraForm errors={errors} register={register} control={control} />,
  ];

  return (
    <>
      <ModalFormMultiStep
        titleModal={modalTitle}
        isOpen={isOpen}
        onClose={onClose}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        textButtonClose="Cancelar"
        textButtonSubmit={buttonTitle}
        loadingButtonSubmit={loading_save}
        isCentered={false}
        steps={steps}
        forms={forms}
        loading={loading}
        isUpdate={isUpdate}
        errors={errors}
      />
    </>
  );
};

export default CrearActualizar;

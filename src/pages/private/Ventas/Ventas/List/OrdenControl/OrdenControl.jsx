import React, { useEffect } from "react";
import ModalFormMultiStep from "../../../../../../components/Modal/ModalFormMultiStep";
import {
  changeState,
  selectLoadingActions,
  selectLoadingVentas,
  selectVentaSelected,
} from "../../../../../../redux/features/ventaSlice";
import DetalleVenta from "./Forms/DetalleVenta";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RECOLECTADO_RESIDUO } from "../../../../../../Utils/constants";

const OrdenControl = ({ isOpen, onClose, isView }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const dispatch = useDispatch();

  const loading = useSelector(selectLoadingVentas);
  const orderSelected = useSelector(selectVentaSelected);
  const loadingActtions = useSelector(selectLoadingActions);

  const status = orderSelected?.status;

  const onSubmit = async (data) => {
    dispatch(
      changeState({
        id: orderSelected.id,
        status: RECOLECTADO_RESIDUO,
        monto_cobrado: data.monto_cobrado || 0,
        comentario_reciclador: data.comentario_reciclador || "",
        fecha_recoleccion_reciclador: data.fecha_recoleccion_reciclador || "",
      })
    );
    onClose();
  };

  const steps = [{ label: "Detalles de la recoleccion" }];

  const forms = [
    <DetalleVenta
      loading={loading}
      orderSelected={orderSelected}
      errors={errors}
      register={register}
      control={control}
      reset={reset}
      key={"form-detalle-venta"}
      isView={isView}
    />,
  ];

  const datos_pago = orderSelected?.datos_pago;

  useEffect(() => {
    reset(datos_pago);
  }, [orderSelected]);

  return (
    <ModalFormMultiStep
      titleModal={"Recolección de residuos"}
      // information={
      //   orderSelected?.comentario_error ||
      //   orderSelected?.motivo_cancelacion ||
      //   ""
      // }
      // boldInformation={
      //   orderSelected?.comentario_error
      //     ? "Motivo de error:"
      //     : orderSelected?.motivo_cancelacion
      //     ? "Motivo de cancelación:"
      //     : ""
      // }
      // informationColor="brand.warning"
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      textButtonClose={isView ? "Cerrar" : "Cancelar"}
      textButtonSubmit={"Guardar"}
      loadingButtonSubmit={loadingActtions}
      isCentered={false}
      steps={steps}
      forms={forms}
      loading={loadingActtions}
      errors={errors}
      notGrid
      isView={isView}
    />
  );
};

export default OrdenControl;

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
import DatosTransferencia from "./Forms/DatosTransferencia";
import {
  PAGO_CONFIRMADO,
  COMPLETADO,
  GENERADO_ORDER,
} from "../../../../../../Utils/constants";

const OrdenControl = ({ isOpen, onClose, isView }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const dispatch = useDispatch();

  const loading = useSelector(selectLoadingVentas);
  const orderSelected = useSelector(selectVentaSelected);
  const loadingActtions = useSelector(selectLoadingActions);

  const status = orderSelected?.status;

  const onSubmit = async () => {
    const new_state = {
      venta_id: orderSelected?.id,
      status:
        status == 1
          ? COMPLETADO
          : status == 0
          ? PAGO_CONFIRMADO
          : GENERADO_ORDER,
      motivo_cancelacion: "",
    };
    await dispatch(changeState(new_state));
    onClose();
  };

  const steps = [
    { label: "Detalle de la Venta" },
    { label: "Datos de la transferencia" },
  ];

  const forms = [
    <DetalleVenta
      loading={loading}
      orderSelected={orderSelected}
      key={"form-detalle-venta"}
    />,
    <DatosTransferencia
      orderSelected={orderSelected}
      errors={errors}
      register={register}
      key={"form-datos-transferencia"}
    />,
  ];

  const datos_pago = orderSelected?.datos_pago;

  useEffect(() => {
    reset(datos_pago);
  }, [orderSelected]);

  return (
    <ModalFormMultiStep
      titleModal={`Orden #${orderSelected?.numero_orden || ""}`}
      information={
        orderSelected?.comentario_error ||
        orderSelected?.motivo_cancelacion ||
        ""
      }
      boldInformation={
        orderSelected?.comentario_error
          ? "Motivo de error:"
          : orderSelected?.motivo_cancelacion
          ? "Motivo de cancelación:"
          : ""
      }
      informationColor="brand.warning"
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      textButtonClose={isView ? "Cerrar" : "Cancelar"}
      textButtonSubmit={
        status == 0
          ? "Confirmar Pago"
          : status == 1
          ? "Confirmar Orden"
          : "Guardar"
      }
      loadingButtonSubmit={loadingActtions}
      isCentered={false}
      steps={steps}
      forms={forms}
      loading={loadingActtions}
      errors={errors}
      notGrid
      isView={
        status === COMPLETADO ||
        isView ||
        (status !== GENERADO_ORDER && status !== PAGO_CONFIRMADO)
      }
    />
  );
};

export default OrdenControl;

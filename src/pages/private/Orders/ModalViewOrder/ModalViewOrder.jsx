import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../../components/Modal/Modal/Modal";

import TextContent from "../../../../components/Texts/TextContent";
import { Flex, Skeleton } from "@chakra-ui/react";
import BadgeStateOrder from "../../../../components/Badge/BadgeStateOrder";
import { onCloseModal } from "../../../../redux/features/modalOrderSlice";
import { selectModalOrder } from "../../../../redux/features/modalOrderSlice";
import {
  selectLoadingupdateOrder,
  selectOrderDataUpdate,
} from "../../../../redux/features/orderSlice";
import Table from "./Table/Table";

const ModalViewOrder = () => {
  const dispatch = useDispatch();

  const orderSelected = useSelector(selectOrderDataUpdate);
  const loading = useSelector(selectLoadingupdateOrder);

  const onClose = () => dispatch(onCloseModal());
  const isOpen = useSelector(selectModalOrder);

  // totales
  const subTotal =
    orderSelected && orderSelected.total ? orderSelected.total : 0;

  const subtotalDelivery =
    orderSelected && orderSelected.deliveryMethod === 2
      ? orderSelected.customerData?.department?.id === 16 &&
        orderSelected.customerData?.town?.id === 16 &&
        orderSelected.total >= 50
        ? 0
        : 35
      : 0;

  const totalWithDelivery =
    orderSelected && orderSelected.total
      ? orderSelected.total + subtotalDelivery
      : 0;

  const date =
    orderSelected &&
    orderSelected.created_at &&
    orderSelected.created_at.toDate();
  const day = date instanceof Object && date.getDate();
  const month = date instanceof Object && date.getMonth() + 1;
  const year = date instanceof Object && date.getFullYear();
  const _date =
    day && month && year ? `${day}/${month}/${year}` : "Sin fecha registrada";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titleModal={
        orderSelected && orderSelected.no_order
          ? `Orden #${orderSelected.no_order}`
          : "Orden"
      }
      titleModal2={_date}
      extraHeader={
        <BadgeStateOrder
          state_order={(orderSelected && orderSelected.order_state) || 0}
          order_chat={
            (orderSelected && orderSelected.generateOrderWhatsapp) || false
          }
          show_badge_order={true}
        />
      }
      onSubmitButton={false}
      textButtonClose="Cerrar"
      loading={loading}
      whatsAppLink={
        (orderSelected && orderSelected.generateOrderWhatsapp) || false
      }
      whatsAppNumber={
        orderSelected &&
        orderSelected.customerData &&
        orderSelected.customerData.telephone
      }
    >
      <Skeleton
        isLoaded={!loading}
        height="100%"
        width="100%"
        borderRadius="10px"
        startColor="brand.gray2"
        endColor="brand.disabled"
      >
        {/* cliente */}
        <Flex gap="7" mt="5">
          <Flex gap="3">
            <TextContent gray>Cliente: </TextContent>
            <TextContent>
              {orderSelected
                ? orderSelected.customerData && orderSelected.customerData.name
                : "Sin nombre cliente"}
            </TextContent>
          </Flex>

          <Flex gap="3">
            <TextContent gray>Teléfono: </TextContent>
            <TextContent>
              {orderSelected
                ? orderSelected.customerData &&
                  orderSelected.customerData.telephone
                : "Sin número de teléfono"}
            </TextContent>
          </Flex>
        </Flex>

        {/* direccion */}
        <Flex gap="7" mt="5">
          <Flex gap="3">
            <TextContent gray>Departamento: </TextContent>
            <TextContent>
              {orderSelected
                ? orderSelected.customerData &&
                  orderSelected.customerData.department.label
                : "Sin departamento"}
            </TextContent>
          </Flex>

          <Flex gap="3">
            <TextContent gray>Municipio: </TextContent>
            <TextContent>
              {orderSelected
                ? orderSelected.customerData &&
                  orderSelected.customerData.town &&
                  orderSelected.customerData.town.label
                : "Sin departamento"}
            </TextContent>
          </Flex>

          <Flex gap="3">
            <TextContent gray>Dirección: </TextContent>
            <TextContent>
              {orderSelected
                ? orderSelected.customerData &&
                  orderSelected.customerData.address
                : "Sin departamento"}
            </TextContent>
          </Flex>

          <Flex gap="3">
            <TextContent gray>Referencia: </TextContent>
            <TextContent>
              {orderSelected
                ? orderSelected.customerData &&
                  orderSelected.customerData.reference
                : "Sin departamento"}
            </TextContent>
          </Flex>
        </Flex>

        <Table
          totales={{
            subTotal,
            total: totalWithDelivery,
            tax: subtotalDelivery,
          }}
        />
      </Skeleton>
    </Modal>
  );
};

export default ModalViewOrder;

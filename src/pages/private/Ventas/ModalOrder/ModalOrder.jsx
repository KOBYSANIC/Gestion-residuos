import React from "react";
import Modal from "../../../../components/Modal/Modal/Modal";
import { Box, Flex, Image, Skeleton } from "@chakra-ui/react";
import TextContent from "../../../../components/Texts/TextContent";
import Table from "./Table/Table";
import { convertSnakeToTitle } from "../../../../Utils/formatedText";

const ModalOrder = ({ isOpen, onClose, orderSelected, loading, isView }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titleModal={
        orderSelected && orderSelected.numero_orden
          ? `Orden #${orderSelected.numero_orden}`
          : "Orden"
      }
      //   titleModal2={_date}
      //   extraHeader={
      //     <BadgeStateOrder
      //       state_order={(orderSelected && orderSelected.order_state) || 0}
      //       order_chat={
      //         (orderSelected && orderSelected.generateOrderWhatsapp) || false
      //       }
      //       show_badge_order={true}
      //     />
      //   }
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
        {orderSelected && orderSelected.orden.length
          ? orderSelected.orden.map((order, id) => {
              return (
                <Box
                  key={id}
                  borderBottom="1px solid"
                  borderColor="gray"
                  mb={8}
                >
                  <Flex gap="7" mt="5" alignItems={"center"}>
                    <Image
                      src={
                        order?.imagen_miniatura ||
                        "/static/images/default/default_product.png"
                      }
                      maxWidth="45px"
                      height="45px"
                      objectFit="cover"
                      borderRadius="5px"
                    />
                    <TextContent fontWeight="bold">
                      {order?.nombreProducto}
                    </TextContent>
                  </Flex>
                  <Flex key={order.id} gap="7" mt="5">
                    {Object.keys(order?.customerInfo).map((customer, id) => {
                      return (
                        <Flex gap="3" key={id}>
                          <TextContent fontWeight="bold">{`${convertSnakeToTitle(
                            customer
                          )}:`}</TextContent>
                          <TextContent opacity="0.8">
                            {order?.customerInfo[customer] || "Sin información"}
                          </TextContent>
                        </Flex>
                      );
                    })}
                  </Flex>
                  <Table items={order?.items} />
                </Box>
              );
            })
          : "Sin productos en la orden"}
      </Skeleton>
    </Modal>
  );
};

export default ModalOrder;

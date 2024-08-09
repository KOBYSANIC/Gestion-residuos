import { Box, Flex, Image, Skeleton } from "@chakra-ui/react";
import React from "react";
import TextContent from "../../../../../../../components/Texts/TextContent";
import Table from "../../../../ModalOrder/Table/Table";
import { convertSnakeToTitle } from "../../../../../../../Utils/formatedText";

const DetalleVenta = ({ orderSelected, loading }) => {
  return (
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
              <Box key={id} borderBottom="1px solid" borderColor="gray" mb={8}>
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
      <Flex gap="1" flexDirection="column" alignItems="flex-end" mr={16}>
        <Flex gap="1">
          <TextContent fontWeight="bold">Subtotal:</TextContent>
          <TextContent opacity="0.8">
            {`${orderSelected?.totales?.subtotal || "0.00"} USD`}
          </TextContent>
        </Flex>
        <Flex gap="1">
          <TextContent fontWeight="bold">Comision:</TextContent>
          <TextContent opacity="0.8">
            {`${orderSelected?.totales?.comision || "0.00"} USD`}
          </TextContent>
        </Flex>
        <Flex gap="1">
          <TextContent fontWeight="bold">Total:</TextContent>
          <TextContent opacity="0.8">
            {`${orderSelected?.totales?.total || "0.00"} USD`}
          </TextContent>
        </Flex>
      </Flex>
    </Skeleton>
  );
};

export default DetalleVenta;

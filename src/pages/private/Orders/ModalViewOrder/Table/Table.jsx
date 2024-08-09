import { Flex, Grid, GridItem, Image } from "@chakra-ui/react";
import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import TextContent from "../../../../../components/Texts/TextContent";
import { selectOrderDataUpdate } from "../../../../../redux/features/orderSlice";
import { formatCurrency } from "../../../../../Utils/currency";
import Footer from "./Footer";

const Table = ({ totales }) => {
  const orderSelected = useSelector(selectOrderDataUpdate);
  return (
    <Grid templateColumns="repeat(9, 1fr)" gap={8} p="8" minW="895px">
      {/* HEDER TABLE */}
      <GridItem
        gridColumn="1 / 4"
        height="100%"
        width="100%"
        display="flex"
        justifyContent="flex-start"
      >
        <TextContent fontWeight="bold">Producto</TextContent>
      </GridItem>
      <GridItem
        gridColumn="4 / 6"
        height="100%"
        width="100%"
        display="flex"
        justifyContent="flex-start"
      >
        <TextContent fontWeight="bold">Código</TextContent>
      </GridItem>
      <GridItem
        gridColumn="6 / 8"
        colSpan={1}
        height="100%"
        width="100%"
        display="flex"
        justifyContent="center"
      >
        <TextContent fontWeight="bold">Precio</TextContent>
      </GridItem>
      <GridItem
        gridColumn="8 / 10"
        colSpan={1}
        height="100%"
        width="100%"
        display="flex"
        justifyContent="center"
      >
        <TextContent fontWeight="bold">Cantidad</TextContent>
      </GridItem>
      <GridItem
        gridColumn="10 / 12"
        colSpan={1}
        height="100%"
        width="100%"
        display="flex"
        justifyContent="center"
      >
        <TextContent fontWeight="bold">Subtotal</TextContent>
      </GridItem>

      {/* DATA TABLE */}
      {orderSelected &&
        orderSelected.cart.map((product) => (
          <Fragment key={product._id}>
            <GridItem
              gridColumn="1 / 4"
              height="100%"
              width="100%"
              // bg="primary.50"
            >
              <Flex gap="8" alignItems="center">
                <Image
                  src={
                    product.image ||
                    "/static/images/default/default_product.png"
                  }
                  maxWidth="60px"
                  height="60px"
                  objectFit="cover"
                />
                <Flex flexDirection="column">
                  <TextContent>{product.product_name}</TextContent>
                  <TextContent color="brand.gray">
                    {product.product_code}
                  </TextContent>
                  <TextContent color="brand.gray">{product.brand} </TextContent>
                </Flex>
              </Flex>
            </GridItem>
            <GridItem
              gridColumn="4 / 6"
              colSpan={1}
              height="100%"
              width="100%"
              // bg="primary.50"
              justifyContent="start"
              alignItems="center"
              display="flex"
            >
              <TextContent>{product.product_code || "Sin Código"}</TextContent>
            </GridItem>
            <GridItem
              gridColumn="6 / 8"
              colSpan={1}
              height="100%"
              width="100%"
              // bg="primary.50"
              justifyContent="center"
              alignItems="center"
              display="flex"
              flexDirection="column"
            >
              {product.active_discount ? (
                <>
                  <TextContent
                    gray
                    fontWeight="bold"
                    fontSize="sm"
                    textDecoration={"line-through"}
                  >
                    {formatCurrency(product.price)}
                  </TextContent>
                  <TextContent>
                    {formatCurrency(product.price_discounted)}
                  </TextContent>
                </>
              ) : (
                <TextContent>{formatCurrency(product.price)}</TextContent>
              )}
            </GridItem>
            <GridItem
              gridColumn="8 / 10"
              colSpan={1}
              height="100%"
              width="100%"
              // bg="primary.50"
              justifyContent="center"
              alignItems="center"
              display="flex"
            >
              <h1>{product.quantity}</h1>
            </GridItem>
            <GridItem
              gridColumn="10 / 12"
              colSpan={1}
              height="100%"
              width="100%"
              // bg="primary.50"
              alignItems="center"
              gap="10"
              justifyContent="center"
              display="flex"
            >
              <TextContent>
                {product.active_discount
                  ? formatCurrency(product.price_discounted * product.quantity)
                  : formatCurrency(product.price * product.quantity)}
              </TextContent>
            </GridItem>
          </Fragment>
        ))}

      {/* FOOTER */}
      <Footer
        deliveryMethod={orderSelected && orderSelected.deliveryMethod}
        totales={totales}
      />
    </Grid>
  );
};

export default Table;

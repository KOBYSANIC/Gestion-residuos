import { Grid, GridItem } from "@chakra-ui/react";
import React, { Fragment } from "react";
import TextContent from "../../../../../components/Texts/TextContent";
import { formatCurrency } from "../../../../../Utils/currency";

const Table = ({ items }) => {
  return (
    <Grid templateColumns="repeat(9, 1fr)" gap={8} pb="8" mt={6} minW="895px">
      {/* HEDER TABLE */}
      <GridItem
        gridColumn="1 / 4"
        height="100%"
        width="100%"
        display="flex"
        justifyContent="flex-start"
      >
        <TextContent fontWeight="bold">Nombre</TextContent>
      </GridItem>
      <GridItem
        gridColumn="4 / 6"
        height="100%"
        width="100%"
        display="flex"
        justifyContent="flex-start"
      >
        <TextContent fontWeight="bold">Precio</TextContent>
      </GridItem>
      <GridItem
        gridColumn="6 / 8"
        colSpan={1}
        height="100%"
        width="100%"
        display="flex"
        justifyContent="center"
      >
        <TextContent fontWeight="bold">Cantidad</TextContent>
      </GridItem>
      <GridItem
        gridColumn="8 / 10"
        colSpan={1}
        height="100%"
        width="100%"
        display="flex"
        justifyContent="center"
      >
        <TextContent fontWeight="bold">Subtotal</TextContent>
      </GridItem>

      {/* DATA TABLE */}
      {items &&
        items.length &&
        items.map((product) => (
          <Fragment key={product.id}>
            <GridItem gridColumn="1 / 4" height="100%" width="100%">
              <TextContent opacity="0.8">
                {product?.titulo_precio || "Sin Nombre"}
              </TextContent>
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
              <TextContent opacity="0.8">{`${
                product?.precio || "Sin Precio"
              } USD`}</TextContent>
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
              <TextContent opacity="0.8">{product.quantity}</TextContent>
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
              <TextContent opacity="0.8">
                {product.active_discount
                  ? `${product.precio * product.quantity} USD`
                  : `${product.precio * product.quantity} USD`}
              </TextContent>
            </GridItem>
          </Fragment>
        ))}
    </Grid>
  );
};

export default Table;

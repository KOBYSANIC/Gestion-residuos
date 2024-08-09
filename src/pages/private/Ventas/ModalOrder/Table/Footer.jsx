import { GridItem } from "@chakra-ui/react";
import React, { Fragment } from "react";
import TextContent from "../../../../../components/Texts/TextContent";
import { formatCurrency } from "../../../../../Utils/currency";

const Footer = ({ deliveryMethod, totales }) => {
  return (
    <Fragment>
      <GridItem
        gridColumn="1 / 4"
        colSpan={1}
        height="100%"
        width="100%"
        alignItems="center"
        gap="10"
        justifyContent="flex-start"
        display="flex"
      >
        <TextContent fontWeight="bold">
          {deliveryMethod === 2 ? "Subtotal" : "Total"}
        </TextContent>
      </GridItem>
      <GridItem
        gridColumn="10 / 12"
        colSpan={1}
        height="100%"
        width="100%"
        alignItems="center"
        gap="10"
        justifyContent="center"
        display="flex"
      >
        <TextContent fontWeight="bold">
          {formatCurrency(totales.subTotal || 0)}
        </TextContent>
      </GridItem>

      {/* Entrega a domicilio */}
      {deliveryMethod === 2 && (
        <Fragment>
          {/* Envio */}
          <GridItem
            gridColumn="1 / 4"
            colSpan={1}
            height="100%"
            width="100%"
            alignItems="center"
            gap="10"
            justifyContent="flex-start"
            display="flex"
          >
            <TextContent fontWeight="bold">Envio</TextContent>
          </GridItem>
          <GridItem
            gridColumn="10 / 12"
            colSpan={1}
            height="100%"
            width="100%"
            alignItems="center"
            gap="10"
            justifyContent="center"
            display="flex"
          >
            <TextContent fontWeight="bold">
              {formatCurrency(totales.tax || 0)}
            </TextContent>
          </GridItem>

          {/* Total */}
          <GridItem
            gridColumn="1 / 4"
            colSpan={1}
            height="100%"
            width="100%"
            alignItems="center"
            gap="10"
            justifyContent="flex-start"
            display="flex"
          >
            <TextContent fontWeight="bold">Total</TextContent>
          </GridItem>
          <GridItem
            gridColumn="10 / 12"
            colSpan={1}
            height="100%"
            width="100%"
            alignItems="center"
            gap="10"
            justifyContent="center"
            display="flex"
          >
            <TextContent fontWeight="bold">
              {formatCurrency(totales.total || 0)}
            </TextContent>
          </GridItem>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Footer;

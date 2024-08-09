import React from "react";

import { Flex, Grid, GridItem, Tag } from "@chakra-ui/react";
import Button from "../../Buttons/Button";
import Subtitle from "../../Texts/Subtitle";

import "./max_text.css";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SidebarRightSellings from "./SidebarRightSellings";
import DollarRateBox from "./TasaDolar";

const SidebarRight = ({ area = "" }) => {
  return (
    <GridItem
      area={area}
      display={{ base: "none", lg: "inherit" }}
      mr="2"
      bg="brand.black_light"
      borderRadius="15px"
    >
      <Grid
        templateRows={"1fr 1fr"}
        templateColumns="1fr"
        flexDirection="column"
        justifyContent="space-around"
        width="100%"
      >
        <Flex
          flexDirection="column"
          borderRadius="10px"
          p="5"
          maxH="60vh"
          minH="60vh"
          overflowY="auto"
        >
          <Subtitle content={"Ventas recientes"} mb="2" />

          <SidebarRightSellings
            Item={"Pase de batalla"}
            Total={8}
            Game={"Valorant"}
          />
          <SidebarRightSellings
            Item={"Bendición lunar"}
            Total={6}
            Game={"Genshin"}
          />
          <SidebarRightSellings Item={"Gift Card Amazon"} Total={10} />
          <SidebarRightSellings Item={"Gemas"} Total={8} Game={"Roblox"} />
          <SidebarRightSellings Item={"Tokens"} Total={5} Game={"Web"} />
          <Tag
            size="md"
            bg="brand.white"
            color="brand.black"
            width="max-content"
            mb="3"
          >
            <FontAwesomeIcon
              icon={faClock}
              size={"1x"}
              style={{ marginRight: "5px" }}
            />
            {"Sin ventas recientes"}
          </Tag>

          <Button
            text="Ver más"
            secondary
            width="100%"
            href="/app/ventas/productos"
          />
        </Flex>
        <Flex maxH="40vh" minH="40vh" borderRadius="10px" p="5">
          <DollarRateBox rate={38.7} />
        </Flex>
      </Grid>
    </GridItem>
  );
};

export default SidebarRight;

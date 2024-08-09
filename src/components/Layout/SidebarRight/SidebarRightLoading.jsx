import { Flex, GridItem, Skeleton } from "@chakra-ui/react";
import React from "react";

const SidebarRightLoading = ({ area = "" }) => {
  return (
    <GridItem
      pl="2"
      area={area}
      display={{ base: "none", lg: "inherit" }}
      mr="6"
      py="5"
    >
      <Flex
        flexDirection="column"
        justifyContent="space-around"
        width="100%"
        height="100%"
        minHeight="800px"
        gap="5"
      >
        <Skeleton
          boxShadow="card"
          borderRadius="10px"
          p="5"
          flex={1}
          startColor="brand.gray2"
          endColor="brand.disabled"
        />

        <Skeleton
          boxShadow="card"
          borderRadius="10px"
          p="5"
          flex={1}
          startColor="brand.gray2"
          endColor="brand.disabled"
        />
      </Flex>
    </GridItem>
  );
};

export default SidebarRightLoading;

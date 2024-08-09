import { TabList as TabListChakra } from "@chakra-ui/react";
import React from "react";

const TabList = ({ children, onClick = () => {}, width="420px" }) => {
  return (
    <TabListChakra
      boxShadow="tab"
      width={width}
      marginX="auto"
      borderRadius="6"
      p="2"
      onClick={onClick}
    >
      {children}
    </TabListChakra>
  );
};

export default TabList;

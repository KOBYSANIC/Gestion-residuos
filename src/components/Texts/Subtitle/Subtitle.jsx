import React from "react";
import { Text } from "@chakra-ui/react";

const Subtitle = ({ content, secondary = false, children, fontSize="2xl", ...props }) => {
  return (
    <Text
      fontSize={fontSize}
      color={secondary ? "secondary.300" : "brand.white"}
      fontWeight="semibold"
      as="h2"
      {...props}
    >
      {children || content}
    </Text>
  );
};

export default Subtitle;

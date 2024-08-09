import React from "react";
import { Text } from "@chakra-ui/react";

const TextContent = ({
  content,
  children,
  fontSize,
  gray = false,
  medium = false,
  marginTop = "",
  marginBottom = "",
  fontWeight = "normal",
  className = "",
  color = "",
  opacity = "",
  mt = "",
  mb = "",
  ml = "",
  mr = "",
  ...props
}) => {
  return (
    <Text
      {...props}
      fontSize={fontSize ? fontSize : medium ? "md" : "sm"}
      color={color ? color : gray ? "brand.gray" : "brand.white"}
      marginBottom={marginBottom}
      marginTop={marginTop}
      fontWeight={fontWeight}
      className={className}
      opacity={opacity}
      mt={mt}
      mb={mb}
      ml={ml}
      mr={mr}
    >
      {content || children}
    </Text>
  );
};

export default TextContent;

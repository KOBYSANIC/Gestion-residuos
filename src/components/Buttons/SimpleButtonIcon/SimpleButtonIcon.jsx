import React from "react";
import { Button as ButtonChakra } from "@chakra-ui/button";
import { Box } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpWideShort } from "@fortawesome/free-solid-svg-icons";

const SimpleButtonIcon = ({
  icon = false,
  disabled = false,
  type = "button",
  width = "48px",
  height = "48px",
  isLoading = false,
  onClick = () => {},
}) => {
  return (
    <ButtonChakra
      minHeight={height}
      maxWidth={width}
      transition="all 0.3s cubic-bezier(.08,.52,.52,1)"
      borderRadius="6px"
      bg="secondary.50"
      leftIcon={
        icon && (
          <Box color="secondary.500">
            <FontAwesomeIcon icon={faArrowUpWideShort} size={"xl"} />
          </Box>
        )
      }
      _hover={{
        bg: "secondary.100",
      }}
      _active={{
        bg: "secondary.50",
        transform: "scale(0.98)",
      }}
      disabled={disabled || isLoading}
      type={type}
      isLoading={isLoading}
      loadingText="Verificando..."
      onClick={onClick}
    ></ButtonChakra>
  );
};

export default SimpleButtonIcon;

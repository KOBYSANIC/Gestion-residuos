import React from "react";
import { Button as ButtonChakra } from "@chakra-ui/button";

const Button = ({
  text = "Button",
  primary = false,
  secondary = false,
  outline = false,
  icon = false,
  alt = "icon",
  disabled = false,
  type = "button",
  width = "200px",
  height = "48px",
  isLoading = false,
  mr = "0",
  href = false,
  onClick = () => {},
}) => {
  // Custom button

  const hover_style = {
    bg: "primary.500",
  };
  if (secondary) {
    hover_style.bg = "secondary.400";
  }

  if (outline) {
    hover_style.bg = "secondary.300";
    hover_style.color = "brand.black";
  }
  return (
    <ButtonChakra
      {...(href && { href: href, as: "a" })}
      height={height}
      width={{ base: "80%", md: width }}
      transition="all 0.3s cubic-bezier(.08,.52,.52,1)"
      border={outline && "2px"}
      borderRadius="6px"
      fontSize="sm"
      fontWeight="semibold"
      mr={mr}
      bg={
        primary
          ? "primary.400"
          : secondary
          ? "secondary.300"
          : outline
          ? "transparent"
          : ""
      }
      borderColor="secondary.300"
      color={
        primary
          ? "brand.black"
          : secondary
          ? "brand.black"
          : outline
          ? "secondary.300"
          : ""
      }
      leftIcon={icon && <img src={icon} alt={alt} />}
      _hover={hover_style}
      _active={{
        bg: primary
          ? "primary.300"
          : secondary
          ? "secondary.200"
          : outline
          ? "secondary.200"
          : "",
        transform: "scale(0.98)",
        borderColor: "secondary.200",
      }}
      disabled={disabled || isLoading}
      type={type}
      isLoading={isLoading}
      loadingText="Verificando..."
      onClick={onClick}
    >
      {text}
    </ButtonChakra>
  );
};

export default Button;

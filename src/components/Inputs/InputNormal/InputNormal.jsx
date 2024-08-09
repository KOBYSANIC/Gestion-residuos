import React from "react";
import { Input } from "@chakra-ui/input";

const InputNormal = ({ placeholder, disabled }) => {
  return (
    <Input
      minHeight="48px"
      autoComplete="off"
      placeholder={placeholder}
      borderColor="brand.gray"
      _placeholder={{ color: "brand.gray_light" }}
      focusBorderColor="secondary.300"
      style={{
        boxSizing: "border-box",
      }}
      _hover={{ borderColor: "brand.gray_light" }}
      _disabled={{
        backgroundColor: "brand.gray_semilight",
        cursor: "not-allowed",
        _hover: { borderColor: "brand.gray_light" },
      }}
      disabled={disabled}
    />
  );
};

export default InputNormal;

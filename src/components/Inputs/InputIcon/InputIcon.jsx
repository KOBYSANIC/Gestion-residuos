import React from "react";
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/input";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faRectangleXmark,
  faSquareCheck,
} from "@fortawesome/free-solid-svg-icons";
import { Box } from "@chakra-ui/react";

const InputIcon = ({
  placeholder,
  disabled,
  error = false,
  success = false,
  onKeyPress = () => {},
  onChange = () => {},
}) => {
  return (
    <InputGroup>
      <InputLeftElement
        pointerEvents="none"
        color="brand.gray_light"
        fontSize="1.2em"
        children={
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            size={"sm"}
            style={{ marginTop: "6px", marginLeft: "7px" }}
          />
        }
      />
      <Input
        onKeyPress={onKeyPress}
        onChange={onChange}
        minHeight="48px"
        autoComplete="off"
        placeholder={placeholder}
        fontSize="sm"
        borderColor={
          error ? "brand.error" : success ? "brand.success" : "brand.gray_light"
        }
        _placeholder={{ color: "brand.gray_light" }}
        focusBorderColor={
          error ? "brand.error" : success ? "brand.success" : "brand.white"
        }
        style={{
          boxSizing: "border-box",
        }}
        disabled={disabled}
        _hover={{
          borderColor: error
            ? "brand.error"
            : success
            ? "brand.success"
            : "brand.gray_light",
        }}
        _disabled={{
          backgroundColor: "brand.gray_semilight",
          cursor: "not-allowed",
          _hover: { borderColor: "brand.gray_light" },
        }}
        color="brand.white"
      />
      {error && (
        <InputRightElement
          children={
            <Box color="brand.error">
              <FontAwesomeIcon
                icon={faRectangleXmark}
                size={"lg"}
                style={{ marginTop: "6px" }}
              />
            </Box>
          }
        />
      )}
      {success && (
        <InputRightElement
          children={
            <Box color="brand.success">
              <FontAwesomeIcon
                icon={faSquareCheck}
                size={"lg"}
                style={{ marginTop: "6px" }}
              />
            </Box>
          }
        />
      )}
    </InputGroup>
  );
};

export default InputIcon;

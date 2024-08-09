import React from "react";

import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/input";
import { Image, Switch } from "@chakra-ui/react";

import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/form-control";

import { ErrorIcon, SuccessIcon } from "../../../Utils/icons";
import useZIndex from "../../../hooks/useZIndex";

const InputSwitchValidation = ({
  // Icon,
  placeholder,
  disabled,
  error = false,
  success = false,
  errors = "",
  // register,
  key_name,
  label = "",
  type = "text",
  marginBottom = "",
  marginTop = "",
}) => {
  const { zIndex, onFocus, onBlur } = useZIndex();
  return (
    <FormControl isInvalid={errors[key_name]}>
      {label && <FormLabel>{label}</FormLabel>}
      <InputGroup>
        {/* <InputLeftElement
          pointerEvents="none"
          color="gray.300"
          fontSize="1.2em"
          zIndex={zIndex}
          // children="$"
          children={
            <Image
              src={Icon}
              alt={"icon"}
              width="17px"
              marginLeft="7px"
              marginTop="6px"
            />
          }
        /> */}
        <Switch
          minHeight="48px"
          autoComplete="off"
          id={key_name}
          placeholder={placeholder}
          borderColor={
            error ? "brand.error" : success ? "brand.success" : "brand.gray_light"
          }
          _placeholder={{ color: "brand.gray_light" }}
          focusBorderColor={
            errors[key_name]
              ? "brand.error"
              : success
              ? "brand.success"
              : "secondary.300"
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
          // {...register(key_name, {
          //   required: "This is required",
          //   minLength: { value: 4, message: "Minimum length should be 4" },
          // })}
          type={type}
          marginBottom={marginBottom}
          marginTop={marginTop}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {errors[key_name] && errors[key_name].message && (
          <InputRightElement
            zIndex={zIndex}
            children={
              <Image
                src={ErrorIcon}
                alt={"icon"}
                width="19px"
                marginRight="7px"
                marginTop="7px"
              />
            }
          />
        )}
        {success && (
          <InputRightElement
            zIndex={1}
            children={
              <Image
                src={SuccessIcon}
                alt={"icon"}
                width="19px"
                marginRight="7px"
                marginTop="7px"
              />
            }
          />
        )}
      </InputGroup>
      <FormErrorMessage>
        {errors[key_name] && errors[key_name].message}
      </FormErrorMessage>
    </FormControl>
  );
};

export default InputSwitchValidation;

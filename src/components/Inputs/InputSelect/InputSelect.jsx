import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";
import React from "react";
import { Controller } from "react-hook-form";
import Select from "react-select";
import { customStyles } from "./customStyles";
import { customTheme } from "./customTheme";
import { faRectangleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const InputSelect = ({
  placeholder,
  options,
  disabled,
  errors = "",
  key_name,
  label = "",
  control,
  validation = false,
  defaultOptionValue = 0,
  isSetValue = false,
  setValue = () => {},
  children,
  name_array,
  ...props
}) => {
  return (
    <FormControl isInvalid={errors[name_array || key_name]} position="relative">
      {label && (
        <FormLabel display="flex">
          {label}
          {validation && (
            <FormLabel m="0" ml="3px" color="brand.secondary">
              *
            </FormLabel>
          )}
        </FormLabel>
      )}
      <Controller
        control={control}
        name={key_name}
        rules={
          validation
            ? {
                required: "Este campo es requerido",
              }
            : {}
        }
        render={({ field: { onChange, value, ref, name } }) => (
          <Select
            defaultOptions
            key={defaultOptionValue}
            className={"react-select"}
            classNamePrefix={"react-select"}
            placeholder={placeholder}
            options={options}
            theme={customTheme}
            onChange={(val) => {
              onChange(val);
              isSetValue && setValue(val.value);
            }}
            styles={customStyles(errors && errors[name_array || key_name])}
            value={value}
            isDisabled={disabled}
            {...props}
          />
        )}
      />
      {children}
      {errors[name_array || key_name] &&
        errors[name_array || key_name].message && (
          <Box
            color="brand.error"
            marginRight="5px"
            bg="brand.black_light"
            marginTop="4px"
            position={"absolute"}
            top={10}
            right={1}
          >
            <FontAwesomeIcon icon={faRectangleXmark} size={"lg"} />
          </Box>
        )}
      <FormErrorMessage>
        {errors[name_array || key_name] &&
          errors[name_array || key_name].message}
      </FormErrorMessage>
    </FormControl>
  );
};

export default InputSelect;

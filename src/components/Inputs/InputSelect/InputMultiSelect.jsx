import React from "react";
import CreatableSelect from "react-select/creatable";
import { customStyles } from "./customStyles";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
} from "@chakra-ui/react";
import { Controller } from "react-hook-form";
import { ErrorIcon } from "../../../Utils/icons";
import { customTheme } from "./customTheme";

const InputMultiSelect = ({
  placeholder,
  options = [],
  errors = "",
  key_name,
  label = "",
  control,
  defaultValue = [],
  isUpdate = false,
  validation = false,
}) => {
  return (
    <FormControl isInvalid={errors[key_name]} position="relative">
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
        render={({ field: { onChange, value, ref, name } }) => {
          return (
            <CreatableSelect
              isClearable
              isMulti
              name="colors"
              onChange={(e) => {
                // return value
                onChange(e ? e.map((item) => item) : null);
              }}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder={placeholder}
              theme={customTheme}
              styles={customStyles(errors && errors[key_name])}
              value={value}
            />
          );
        }}
      />
      {errors[key_name] && errors[key_name].message && (
        <Image
          src={ErrorIcon}
          alt={"icon"}
          width="19px"
          marginRight="7px"
          marginTop="7px"
          position={"absolute"}
          top={10}
          right={1}
        />
      )}
      <FormErrorMessage>
        {errors[key_name] && errors[key_name].message}
      </FormErrorMessage>
    </FormControl>
  );
};

export default InputMultiSelect;

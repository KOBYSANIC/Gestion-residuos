import React from "react";
import AsyncSelect from "react-select/async";
import { customStyles } from "./customStyles";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
} from "@chakra-ui/react";
import { Controller } from "react-hook-form";
import { ErrorIcon } from "../../../Utils/icons";
import useAsyncOptions from "../../../hooks/useAsyncOptions";
import { customTheme } from "./customTheme";

const InputAsyncSelect = ({
  placeholder,
  disabled,
  errors = "",
  key_name,
  label = "",
  control,
  validation = false,
  labelKey = "label",
  labelKey2 = "",
  valueKey = "value",
  collection_name = "",
  search_field_name = "",
  name_array,
  filter_active = true,
  extraOptions = [],
}) => {
  const { asyncOptions } = useAsyncOptions(
    collection_name,
    search_field_name,
    filter_active,
    extraOptions
  );
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
          <AsyncSelect
            cacheOptions
            defaultOptions
            placeholder={placeholder}
            onChange={(e) => {
              if (e) {
                const { created_at, updated_at, ...rest } = e;
                onChange(rest);
              } else {
                onChange(null);
              }
            }}
            loadOptions={asyncOptions}
            theme={customTheme}
            styles={customStyles(errors && errors[name_array || key_name])}
            isDisabled={disabled}
            getOptionLabel={(option) =>
              `${option[labelKey]} ${option[labelKey2] || ""}`
            }
            value={value}
          />
        )}
      />
      {errors[name_array || key_name] &&
        errors[name_array || key_name].message && (
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
        {errors[name_array || key_name] &&
          errors[name_array || key_name].message}
      </FormErrorMessage>
    </FormControl>
  );
};

export default InputAsyncSelect;

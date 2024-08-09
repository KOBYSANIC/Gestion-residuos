import React from "react";

import { Controller } from "react-hook-form";

import JoditEditor from "jodit-react";

import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/form-control";

import { config } from "./config";

const InputJodit = ({
  placeholder,
  control,
  errors = "",
  key_name,
  validation = false,
  label = "",
}) => {
  if (placeholder) {
    config.placeholder = placeholder;
  }

  return (
    <FormControl isInvalid={errors[key_name]}>
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
          <JoditEditor
            key_name={key_name}
            name={key_name}
            config={config}
            tabIndex={-1}
            onChange={onChange}
            value={value}
            className="jodit_custom_theme"
          />
        )}
      />

      <FormErrorMessage>
        {errors[key_name] && errors[key_name].message}
      </FormErrorMessage>
    </FormControl>
  );
};

export default InputJodit;

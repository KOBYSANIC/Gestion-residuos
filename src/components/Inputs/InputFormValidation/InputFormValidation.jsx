import React, { useEffect, useState } from "react";

import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/input";

import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/form-control";

import useZIndex from "../../../hooks/useZIndex";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRectangleXmark,
  faSquareCheck,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { Text } from "@chakra-ui/react";

const InputFormValidation = ({
  Icon,
  placeholder,
  disabled,
  error = false,
  success = false,
  errors = "",
  register,
  key_name,
  label = "",
  type = "text",
  marginBottom = "",
  marginTop = "",
  validation = true,
  step = "",
  noScroll = false,
  minLength = 4,
  min,
  max,
  onChange,
  mt = "",
  defaultValue = "",
  name_array = "",
  textBottom = "",
  required = true,
}) => {
  const { zIndex, onFocus, onBlur } = useZIndex();
  // Estado para cambiar el icono
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    document.addEventListener("wheel", function (event) {
      if (
        document.activeElement.type === "number" &&
        document.activeElement.classList.contains("noscroll")
      ) {
        document.activeElement.blur();
      }
    });
  }, []);

  return (
    <FormControl marginTop={mt} isInvalid={errors[name_array || key_name]}>
      {label && (
        <FormLabel display="flex">
          {label}
          {validation && required && (
            <FormLabel m="0" ml="3px" color="brand.secondary">
              *
            </FormLabel>
          )}
        </FormLabel>
      )}
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          color={disabled ? "brand.gray_light" : "brand.secondary"}
          mt="3px"
          children={<FontAwesomeIcon icon={Icon} size={"lg"} />}
        />
        <Input
          className={noScroll ? "noscroll" : ""}
          minHeight="48px"
          autoComplete="off"
          id={key_name}
          placeholder={placeholder}
          borderColor={
            error
              ? "brand.error"
              : success
              ? "brand.success"
              : "brand.gray_light"
          }
          _placeholder={{ color: "brand.gray_light" }}
          focusBorderColor={
            errors[name_array || key_name]
              ? "brand.error"
              : success
              ? "brand.success"
              : "secondary.300" // brand.white
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
          {...register(
            key_name,
            validation
              ? {
                  required: required && "Este campo es requerido",
                  minLength: {
                    value: minLength,
                    message: `Debe tener al menos ${minLength} caracteres`,
                  },
                  ...(type === "number" && {
                    min: {
                      value: min,
                      message: `Debe ser mayor o igual a ${min}`,
                    },
                    max: {
                      value: max,
                      message: `Debe ser menor o igual a ${max}`,
                    },
                  }),
                  pattern: {
                    value: /^\S$|^\S.*\S$/,
                    message:
                      "Debe ser una sola letra o no debe contener espacios en blanco al inicio y al final",
                  },
                  ...(type === "date"
                    ? {
                        validate: {
                          futureDate: (value) => {
                            const dateValue = new Date(value);
                            if (dateValue < new Date(min)) {
                              return `La fecha debe ser mayor o igual que ${min}`;
                            } else if (dateValue > new Date(max)) {
                              return `La fecha debe ser menor o igual que ${max}`;
                            }
                            return true;
                          },
                        },
                      }
                    : {}),
                }
              : {}
          )}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          marginBottom={marginBottom}
          marginTop={marginTop}
          onFocus={onFocus}
          onBlur={onBlur}
          step={step}
          {...(defaultValue && { value: defaultValue })}
          {...(onChange && { onInputCapture: onChange })}
        />
        {errors[name_array || key_name] &&
          errors[name_array || key_name].message &&
          type !== "password" && (
            <InputRightElement
              zIndex={zIndex}
              color="brand.error"
              mt="4px"
              children={<FontAwesomeIcon icon={faRectangleXmark} size={"lg"} />}
            />
          )}
        {success && type !== "password" && (
          <InputRightElement
            zIndex={1}
            color="brand.success"
            mt="4px"
            children={<FontAwesomeIcon icon={faSquareCheck} size={"lg"} />}
          />
        )}

        {type === "password" && (
          <InputRightElement
            mt="4px"
            children={
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                onClick={togglePassword}
                cursor={"pointer"}
              />
            }
          />
        )}
      </InputGroup>

      {textBottom && (
        <Text fontSize="xs" color="brand.gray_light">
          {textBottom}
        </Text>
      )}

      <FormErrorMessage>
        {errors[name_array || key_name] &&
          errors[name_array || key_name].message}
      </FormErrorMessage>
    </FormControl>
  );
};

export default InputFormValidation;

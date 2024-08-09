import React, { useState } from "react";

import { Input } from "@chakra-ui/input";
import {
  AspectRatio,
  Box,
  Flex,
  forwardRef,
  Grid,
  Heading,
  Icon,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";

import {
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/form-control";

import { toast } from "react-hot-toast";

import { motion, useAnimation } from "framer-motion";

import { SmallCloseIcon } from "@chakra-ui/icons";
import { useEffect } from "react";
import TextContent from "../../Texts/TextContent";
import { Controller } from "react-hook-form";

const first = {
  rest: {
    rotate: "-15deg",
    scale: 0.95,
    x: "-50%",
    filter: "grayscale(80%)",
    transition: {
      duration: 0.5,
      type: "tween",
      ease: "easeIn",
    },
  },
  hover: {
    x: "-70%",
    scale: 1.1,
    rotate: "-20deg",
    filter: "grayscale(0%)",
    transition: {
      duration: 0.4,
      type: "tween",
      ease: "easeOut",
    },
  },
};

const second = {
  rest: {
    rotate: "15deg",
    scale: 0.95,
    x: "50%",
    filter: "grayscale(80%)",
    transition: {
      duration: 0.5,
      type: "tween",
      ease: "easeIn",
    },
  },
  hover: {
    x: "70%",
    scale: 1.1,
    rotate: "20deg",
    filter: "grayscale(0%)",
    transition: {
      duration: 0.4,
      type: "tween",
      ease: "easeOut",
    },
  },
};

const third = {
  rest: {
    scale: 1.1,
    filter: "grayscale(80%)",
    transition: {
      duration: 0.5,
      type: "tween",
      ease: "easeIn",
    },
  },
  hover: {
    scale: 1.3,
    filter: "grayscale(0%)",
    transition: {
      duration: 0.4,
      type: "tween",
      ease: "easeOut",
    },
  },
};

const PreviewImage = forwardRef((props, ref) => {
  return (
    <Box
      bg="white"
      top="0"
      height="100%"
      width="100%"
      position="absolute"
      borderWidth="1px"
      borderStyle="solid"
      rounded="sm"
      borderColor="gray.400"
      as={motion.div}
      backgroundSize="cover"
      backgroundRepeat="no-repeat"
      backgroundPosition="center"
      backgroundImage={`url("https://image.shutterstock.com/image-photo/paella-traditional-classic-spanish-seafood-600w-1662253543.jpg")`}
      {...props}
      ref={ref}
    />
  );
});

const InputUploadFile = ({
  disabled,
  error = false,
  success = false,
  errors = "",
  control,
  key_name,
  label = "",
  marginBottom = "",
  marginTop = "",
  linkImage = true,
  validation = false,
}) => {
  const controls = useAnimation();
  const startAnimation = () => controls.start("hover");
  const stopAnimation = () => controls.stop();

  const [images, setImages] = useState([]);

  useEffect(() => {
    return () => {
      setImages([]);
    };
  }, []);

  return (
    <>
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

        <AspectRatio width="" ratio="2">
          <Box
            borderColor={
              errors[key_name] && errors[key_name].message
                ? "brand.error"
                : "brand.gray_light"
            }
            borderStyle="dashed"
            borderWidth="2px"
            rounded="md"
            transition="all 150ms ease-in-out"
            _hover={{
              borderColor:
                !errors[key_name] &&
                !errors[key_name]?.message &&
                "brand.secondary",
            }}
            as={motion.div}
            initial="rest"
            animate="rest"
            whileHover="hover"
          >
            <Box position="relative" height="100%" width="100%">
              <Box
                position="absolute"
                top="0"
                left="0"
                height="100%"
                width="100%"
                display="flex"
                flexDirection="column"
              >
                <Stack
                  height="100%"
                  width="100%"
                  display="flex"
                  alignItems="center"
                  justify="center"
                  spacing="4"
                >
                  <Box height="16" width="12" top="6" position="relative">
                    <PreviewImage
                      variants={first}
                      backgroundImage="url('https://images.pexels.com/photos/776092/pexels-photo-776092.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')"
                    />
                    <PreviewImage
                      variants={second}
                      backgroundImage="url('https://images.pexels.com/photos/14824330/pexels-photo-14824330.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')"
                    />
                    <PreviewImage
                      variants={third}
                      backgroundImage={`url('https://images.pexels.com/photos/371924/pexels-photo-371924.jpeg')`}
                    />
                  </Box>
                  <Stack p="8" textAlign="center" spacing="1">
                    <Heading
                      fontSize="lg"
                      color="secondary.100"
                      fontWeight="bold"
                    >
                      Arrastra y suelta tu imagen
                    </Heading>
                    <Text fontWeight="light">
                      o haz click para seleccionar una imagen
                    </Text>
                  </Stack>
                </Stack>
              </Box>

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
                  value && setImages(value);
                  return (
                    <Input
                      height="100%"
                      width="100%"
                      // id={key_name}
                      borderColor={
                        error
                          ? "brand.error"
                          : success
                          ? "brand.success"
                          : "brand.gray_light"
                      }
                      disabled={disabled}
                      _disabled={{
                        backgroundColor: "brand.gray_semilight",
                        cursor: "not-allowed",
                        _hover: { borderColor: "brand.gray_light" },
                      }}
                      type="file"
                      onChange={(e) => {
                        // set if type file is an image
                        if (e.target.files[0].type.includes("image")) {
                          const image = [e.target.files[0]];
                          setImages(image);
                          onChange(image);
                        } else toast.error("El archivo no es una imagen");
                      }}
                      marginBottom={marginBottom}
                      marginTop={marginTop}
                      position="absolute"
                      top="0"
                      left="0"
                      opacity="0"
                      aria-hidden="true"
                      accept="image/*"
                      onDragEnter={startAnimation}
                      onDragLeave={stopAnimation}
                    />
                  );
                }}
              />
            </Box>
          </Box>
        </AspectRatio>

        <Grid templateColumns="repeat(auto-fill, 75px)" gap={6} marginTop="6">
          {images.length > 0 ? (
            images.map((image, index) => {
              const image_url =
                typeof image === "string" ? image : URL.createObjectURL(image);
              return (
                <Flex flexDirection="column" position="relative" key={index}>
                  {/* <Icon
                    as={SmallCloseIcon}
                    w={8}
                    h={8}
                    p="1"
                    position="absolute"
                    top="-2"
                    right="-4"
                    color="brand.gray"
                    cursor="pointer"
                    borderRadius="md"
                    transition={disabled ? "none" : "all 150ms ease-in-out"}
                    _hover={
                      !disabled && {
                        // backgroundColor: "brand.disabled",
                        color: "brand.error",
                        transition: "all 150ms ease-in-out",
                      }
                    }
                    onClick={() => {
                      const newImages = images.filter(
                        (image, i) => i !== index
                      );
                      setImages(newImages);
                    }}
                  /> */}

                  {linkImage ? (
                    <a href={image_url} target="_blank">
                      <Image
                        src={image_url}
                        minWidth="70px"
                        maxWidth="70px"
                        height="70px"
                        objectFit="cover"
                        rounded="md"
                        marginRight="2"
                      />
                    </a>
                  ) : (
                    <Image
                      src={image_url}
                      minWidth="70px"
                      maxWidth="70px"
                      height="70px"
                      objectFit="cover"
                      rounded="md"
                      marginRight="2"
                    />
                  )}
                </Flex>
              );
            })
          ) : (
            <TextContent small>No hay imágenes cargadas</TextContent>
          )}
        </Grid>

        <FormErrorMessage>
          {errors[key_name] && errors[key_name].message}
        </FormErrorMessage>
      </FormControl>
    </>
  );
};

export default InputUploadFile;

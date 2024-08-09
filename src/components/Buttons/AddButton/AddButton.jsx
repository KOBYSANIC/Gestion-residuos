import { Box, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import React from "react";

const AddButton = ({
  title = "+",
  content = "Agregar",
  onClick = () => {},
}) => {
  return (
    <Box
      borderStyle="dashed"
      borderWidth="2px"
      rounded="md"
      transition="all 150ms ease-in-out"
      as={motion.div}
      initial="rest"
      animate="rest"
      whileHover="hover"
      onClick={onClick}
      cursor="pointer"
      gridColumn={{ base: "span 2" }}
      p={4}
      color="brand.gray_light"
      borderColor={"brand.gray_light"}
      _hover={{
        borderColor: "brand.white",
        color: "brand.white",
      }}
    >
      <Text textAlign="center" fontSize="40px">
        {title}
      </Text>
      <Text fontSize="lg" textAlign="center" mb={4}>
        {content}
      </Text>
    </Box>
  );
};

export default AddButton;

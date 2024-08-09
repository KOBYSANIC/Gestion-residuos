import { Spinner as SpinnerChakra } from "@chakra-ui/react";
import React from "react";

const Spinner = () => {
  return (
    <SpinnerChakra
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="secondary.300"
      size="lg"
    />
  );
};

export default Spinner;

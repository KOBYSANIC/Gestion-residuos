import React from "react";

import { Box, Badge as ChakraBadge, Flex, Image } from "@chakra-ui/react";
import { WarningIcon } from "../../Utils/icons";

const Badge = ({
  colorScheme,
  textContent,
  animation,
  ml,
  mt,
  content = true,
  variant = "solid",
}) => {
  return (
    <Box display={"inline-block"} marginLeft={ml} marginTop={mt}>
      <Flex>
        {content && (
          <ChakraBadge
            variant={variant}
            colorScheme={colorScheme}
            height={6}
            lineHeight={6}
            minWidth="100px"
            textAlign={"center"}
            textTransform="inherit"
            borderRadius={5}
          >
            {textContent}
          </ChakraBadge>
        )}
        {animation && (
          <Image
            src={WarningIcon}
            alt="warning-icon"
            w={"18px"}
            marginLeft={"10px"}
            className="img-warning"
          />
        )}
      </Flex>
    </Box>
  );
};

export default Badge;

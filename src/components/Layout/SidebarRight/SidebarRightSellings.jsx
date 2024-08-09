import React from "react";
import { Box, Text } from "@chakra-ui/react";

const SidebarRightSellings = ({ Item, Total, Game}) => {
  return (
    <Box bg="brand.white" borderRadius="8px" fontWeight="medium" p="2" mb="2">
      <Text color="black">
        {Item} 
        {Game && (` - ${Game}`) }
      </Text>

      <Text color="black" >
        Total: ${Total}
      </Text>
    </Box>
  );
};

export default SidebarRightSellings;

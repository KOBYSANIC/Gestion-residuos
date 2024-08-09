import { Tab as TabChakra } from "@chakra-ui/react";

const Tab = ({ children, onClick = () => {} }) => {
  return (
    <TabChakra
      w="140px"
      h="33px"
      borderRadius="6"
      color="brand.gray"
      bg="brand.white"
      _selected={{
        bg: "secondary.50",
      }}
      _hover={{
        bg: "secondary.100",
      }}
      onClick={onClick}
    >
      {children}
    </TabChakra>
  );
};

export default Tab;

import React from "react";
import {
  Drawer,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerContent,
  GridItem,
} from "@chakra-ui/react";

import { useDispatch, useSelector } from "react-redux";
import {
  selectSidebar,
  toggleSidebar,
} from "../../../redux/features/sidebarSlice";

import { SidebarContent } from "./SidebarContent";

const Sidebar = ({ variant, area }) => {
  // sidebar redux state
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector(selectSidebar);

  const onClose = () => dispatch(toggleSidebar());

  return variant === "sidebar" ? (
    <GridItem
      px="1"
      bg="brand.black_light"
      area={area}
      display={{ base: "none", md: "block" }}
      h="100vh"
    >
      <SidebarContent />
    </GridItem>
  ) : (
    <Drawer isOpen={isSidebarOpen} placement="left" onClose={onClose}>
      <DrawerOverlay>
        <DrawerContent bg="brand.black_light">
          <DrawerCloseButton />
          <DrawerHeader>Residuos</DrawerHeader>
          <DrawerBody>
            <SidebarContent onMobile />
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

export default Sidebar;

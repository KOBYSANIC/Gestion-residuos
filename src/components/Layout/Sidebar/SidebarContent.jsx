import React, { useState } from "react";
import { Accordion, Box, Flex } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { useLogOut } from "../../../hooks/useLogOut";
import SideButton from "../../Buttons/SideButton";
import { routes } from "../../../routers/routes";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import Subtitle from "../../Texts/Subtitle";
import { useTypeDevice } from "../../../hooks/useTypeDevice";
import TextContent from "../../Texts/TextContent";

export const SidebarContent = ({ onMobile = false }) => {
  const [activeButton, setActiveButton] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const { logOut, user } = useLogOut();
  const location = useLocation();

  const activeRoute = (routeName) => {
    const pathname = location.pathname;
    return pathname === routeName || pathname.includes(routeName);
  };

  const routesSidebar = routes.filter((route) => route.showSidebar);

  const { isLaregeMobileTablet } = useTypeDevice();

  const isResponsive = !onMobile && !isLaregeMobileTablet;

  const handleAccordionChange = (index) => {
    // Actualizar el estado con el nuevo índice expandido/contraído
    setExpandedIndex(index);
  };

  return (
    <Flex
      flexDirection="column"
      alignItems="flex-start"
      p={{ base: 0, md: 3 }}
      position="relative"
      h={"full"}
      overflow="auto"
    >
      <a href="/">
        <TextContent content="Regresar al inicio" />
      </a>
      <Subtitle
        content="Menú"
        my={{ base: "4", md: "10" }}
        fontSize={{ base: "1x", xl: "2xl" }}
        w="full"
        textAlign={{ base: "center", xl: "left" }}
      />
      <Accordion w="full" allowToggle onChange={handleAccordionChange}>
        {routesSidebar.map((route, key) => {
          if (!route.accessValidate.includes(user?.role)) return null;

          return (
            <Box key={key} onClick={() => setActiveButton(route.name)}>
              <SideButton
                location={location}
                icon={route.icon}
                text={route.name}
                responsive={isResponsive}
                active={
                  activeRoute(`/app${route.path}`) ||
                  (activeButton === route.name && expandedIndex !== -1)
                }
                to={`/app${route.path}`}
                subMenu={route.subMenu}
                mb="2"
              />
            </Box>
          );
        })}
      </Accordion>
      <SideButton
        icon={faRightToBracket}
        text={"Cerrar Sesión"}
        responsive={isResponsive}
        active={false}
        buttonLink={false}
        onClick={logOut}
        bottom
      />
    </Flex>
  );
};

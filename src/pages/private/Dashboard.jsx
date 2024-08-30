import { Box, Grid, GridItem, useBreakpointValue } from "@chakra-ui/react";
import React, { Suspense } from "react";
import Header from "../../components/Layout/Header/Header.jsx";
import Sidebar from "../../components/Layout/Sidebar/Sidebar.jsx";
import SidebarRightLoading from "../../components/Layout/SidebarRight/SidebarRightLoading.jsx";
import { useTypeDevice } from "../../hooks/useTypeDevice.js";
import ModalViewEvent from "./Events/ModalViewEvent/ModalViewEvent.jsx";
import ModalViewOrder from "./Orders/ModalViewOrder/ModalViewOrder.jsx";

const SidebarRight = React.lazy(() =>
  import("../../components/Layout/SidebarRight/SidebarRight.jsx")
);

const smVariant = { navigation: "drawer", navigationButton: true };
const mdVariant = { navigation: "sidebar", navigationButton: false };

const Dashboard = ({ children }) => {
  const variants = useBreakpointValue({ base: smVariant, md: mdVariant });

  const { isDesktopSmall } = useTypeDevice();

  return (
    <>
      {/* Modal view Event */}
      <ModalViewOrder />
      <ModalViewEvent />
      <Grid
        templateAreas={{
          base: `"nav"
              "main"`,
          md: `"side nav"
              "side main"`,
          lg: `"side nav"
            "side main "`,
        }}
        gridTemplateRows={"70px 1fr"}
        gridTemplateColumns={{
          base: "1fr",
          md: "90px 1fr",
          lg: "90px 1fr ",
          xl: "256px 1fr ",
        }}
        maxHeight="100vh"
        gap="5"
        color="blackAlpha.700"
        overflow="hidden"
      >
        {/* ----Grid item for header---- */}
        <Header area="nav" showSidebarButton={variants?.navigationButton} />

        {/* ----Grid item for sidebar---- */}
        <Sidebar area={"side"} variant={variants?.navigation} />

        {/* ----Grid item for main content---- */}
        <GridItem area={"main"} maxHeight="100vh" overflow="auto" px="2" mb="2">
          <Box bg="brand.black_light" borderRadius="15px" px={2} h="100%">
            {children}
          </Box>
        </GridItem>

        {/* ----Grid item for sidebar right---- */}
        {/* {isDesktopSmall && (
          <Suspense fallback={<SidebarRightLoading />}>
            <SidebarRight area="sideright" />
          </Suspense>
        )} */}
      </Grid>
    </>
  );
};

export default Dashboard;

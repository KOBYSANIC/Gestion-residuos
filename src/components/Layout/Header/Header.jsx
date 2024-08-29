import {
  Flex,
  GridItem,
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  Button,
  Box,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { useLogOut } from "../../../hooks/useLogOut";
import { useTypeDevice } from "../../../hooks/useTypeDevice";
import { toggleSidebar } from "../../../redux/features/sidebarSlice";
import { role_name } from "../../../Utils/constants";
import TextContent from "../../Texts/TextContent/TextContent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faBars } from "@fortawesome/free-solid-svg-icons";

const Header = ({ showSidebarButton = true, area = "" }) => {
  const dispatch = useDispatch();
  const onShowSidebar = () => dispatch(toggleSidebar());
  const { isMobile } = useTypeDevice();

  const { user, logOut } = useLogOut();

  const handleLogOut = () => {
    logOut();
  };

  return (
    <GridItem area={area} as="header" pt="3" px="2" h="100%">
      <Flex
        py="7px"
        px="15px"
        position="relative"
        bg="brand.black_light"
        height="max-content"
        borderRadius="15px"
        alignItems="center"
        justifyContent={showSidebarButton ? "space-between" : "flex-end"}
        zIndex={999}
      >
        {showSidebarButton && (
          <Box color="brand.white" onClick={onShowSidebar} cursor="pointer">
            <FontAwesomeIcon icon={faBars} size={"2x"} />
          </Box>
        )}
        <Flex>
          <Flex flexDirection="column" mr="8px" justifyContent="center">
            <TextContent content={user?.user_name} fontWeight="bold" />
            <TextContent content={role_name[user?.role]} />
          </Flex>
        </Flex>
      </Flex>
    </GridItem>
  );
};

export default Header;

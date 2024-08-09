import React from "react";
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Tooltip,
} from "@chakra-ui/react";
import { Link, NavLink } from "react-router-dom";
import TextContent from "../../Texts/TextContent/TextContent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SideButton = ({
  location,
  text = "",
  icon = "",
  active = false,
  onClick = () => {},
  buttonLink = true,
  to = "/",
  subMenu = false,
  mb = "",
  bottom = false,
  responsive = false,
}) => {
  const buttonStyle = {
    borderRadius: "15px",
    alignItems: "center",
    px: "14px",
    py: "10px",
    my: "1px",
    transition: "all 0.3s ease",
    _hover: {
      bgColor: !active && "brand.gray",
    },
  };

  const linkStyle = {
    ...buttonStyle,
    bgColor: active ? "brand.secondary" : "transparent",
    w: "full",
  };

  const textStyle = {
    color: active ? "brand.black" : "brand.white",
  };

  const activeRoute = (routeName) => {
    const pathname = location.pathname;
    return pathname === routeName;
  };

  return (
    <Box w="full" mb={mb} mt={bottom && "auto"}>
      {buttonLink ? (
        subMenu ? (
          <AccordionItem border="none">
            <Tooltip
              label={text}
              placement={"right"}
              {...(!responsive && { isOpen: false })}
            >
              <AccordionButton p="0" m="0">
                <Flex {...linkStyle}>
                  <Flex
                    w="full"
                    alignItems="center"
                    justifyContent={responsive ? "center" : "flex-start"}
                  >
                    <Box
                      color={active ? "brand.black" : "brand.secondary"}
                      {...(!responsive && { mr: "10px" })}
                    >
                      <FontAwesomeIcon
                        icon={icon}
                        size={responsive ? "xl" : "1x"}
                      />
                    </Box>
                    {!responsive && (
                      <TextContent color={textStyle.color}>{text}</TextContent>
                    )}
                    {subMenu && (
                      <Box ml="auto">
                        <AccordionIcon
                          color={active ? "brand.black" : "brand.white"}
                        />
                      </Box>
                    )}
                  </Flex>
                </Flex>
              </AccordionButton>
            </Tooltip>
            <AccordionPanel color="brand.white" p="0" m="0" ml="10px">
              {subMenu &&
                subMenu.map((item, key) => (
                  <NavLink key={key} to={`/app${item.path}`}>
                    {/* circle */}
                    <Flex
                      alignItems="center"
                      borderRadius="15px"
                      _hover={{
                        bgColor: "brand.gray",
                      }}
                      bgColor={
                        activeRoute(`/app${item.path}`)
                          ? "brand.gray"
                          : "transparent"
                      }
                      pl="12px"
                      py="6px"
                      my="8px"
                      w="full"
                      transition="all 0.3s ease"
                    >
                      <Box
                        borderRadius="50%"
                        w="7px"
                        h="7px"
                        mr="10px"
                        bgColor={
                          activeRoute(`/app${item.path}`)
                            ? "brand.secondary"
                            : "brand.gray_light"
                        }
                      />

                      <Box>
                        <TextContent
                          color={
                            activeRoute(`/app${item.path}`)
                              ? "brand.white"
                              : "brand.gray_light"
                          }
                          fontWeight={
                            activeRoute(`/app${item.path}`) ? "bold" : "normal"
                          }
                          content={
                            !responsive
                              ? item.name
                              : item.name.charAt(0).toUpperCase()
                          }
                        />
                      </Box>
                    </Flex>
                  </NavLink>
                ))}
            </AccordionPanel>
          </AccordionItem>
        ) : (
          <Link to={to}>
            <AccordionItem border="none">
              <Tooltip
                label={text}
                placement={"right"}
                {...(!responsive && { isOpen: false })}
              >
                <AccordionButton p="0" m="0">
                  <Flex {...linkStyle}>
                    <Flex
                      w="full"
                      alignItems="center"
                      justifyContent={responsive ? "center" : "flex-start"}
                    >
                      <Box
                        color={active ? "brand.black" : "brand.secondary"}
                        {...(!responsive && { mr: "10px" })}
                      >
                        <FontAwesomeIcon
                          icon={icon}
                          size={responsive ? "xl" : "1x"}
                        />
                      </Box>
                      {!responsive && (
                        <TextContent color={textStyle.color}>
                          {text}
                        </TextContent>
                      )}
                    </Flex>
                  </Flex>
                </AccordionButton>
              </Tooltip>
            </AccordionItem>
          </Link>
        )
      ) : (
        <Flex {...buttonStyle} onClick={onClick} cursor="pointer">
          <Flex w="full" alignItems="center">
            <Box color={"brand.secondary"} {...(!responsive && { mr: "10px" })}>
              <FontAwesomeIcon icon={icon} size={responsive ? "xl" : "1x"} />
            </Box>
            {!responsive && (
              <TextContent color={textStyle.color}>{text}</TextContent>
            )}
          </Flex>
        </Flex>
      )}
    </Box>
  );
};

export default SideButton;

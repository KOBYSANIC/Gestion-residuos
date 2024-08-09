import React, { useState } from "react";
import { Button as ButtonChakra } from "@chakra-ui/button";
import { Menu, MenuButton, Box, MenuList, MenuItem } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

const TableButton = ({
  disabled = false,
  width = "48px",
  height = "10px",
  isLoading = false,
  items,
  children,
}) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton
            as={ButtonChakra}
            maxHeight={height}
            maxWidth={width}
            transition="all 0.3s cubic-bezier(.08,.52,.52,1)"
            borderRadius="6px"
            bg={"transparent"}
            leftIcon={
              <Box pl="6px">
                <FontAwesomeIcon icon={faEllipsis} size={"xl"} />
              </Box>
            }
            _hover={{ bg: "brand.gray_semilight" }}
            _active={{
              bg: "brand.gray_semilight",
            }}
            disabled={disabled || isLoading}
            isLoading={isLoading}
            loadingText="Verificando..."
            onMouseOver={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          />
          <MenuList bg="brand.black" borderColor="brand.gray_light">
            {items?.map((item, index) => {
              return (
                !item.hidden && (
                  <MenuItem
                    key={index}
                    bg="brand.black"
                    _hover={{ bg: "brand.gray" }}
                    _active={{ bg: "brand.gray" }}
                    _focus={{ bg: "brand.gray" }}
                    onClick={item.onClick}
                  >
                    {item.name}
                  </MenuItem>
                )
              );
            })}
          </MenuList>
          {children}
        </>
      )}
    </Menu>
  );
};

export default TableButton;

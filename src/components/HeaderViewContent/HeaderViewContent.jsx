import React from "react";

import { Flex } from "@chakra-ui/react";

import SimpleButtonIcon from "../Buttons/SimpleButtonIcon";
import Button from "../Buttons/Button";
import Title from "../Texts/Title";

import { FilterBlueIcon, SearchIcon } from "../../Utils/icons";
import InputIcon from "../Inputs/InputIcon";

export const HeaderViewContent = ({
  titleView,
  textButton,
  showFilterButton = true,
  showSearchButton = true,
  showCreateButton = true,
  showExcelButton = false,
  onOpen,
  onOpenFilers,
  searchTitle = "Buscar...",
  onKeyPress = () => {},
  onChange = () => {},
  onClickExcel = () => {},
  loadingExcel = false,
}) => {
  return (
    <Flex
      position="sticky"
      top="0"
      zIndex="1"
      justifyContent="space-between"
      alignItems={{ base: "start", sm: "center", md: "center" }}
      mb="2"
      flexDirection={{ base: "column", lg: "row" }}
      pt="2"
      px="2"
    >
      <Title content={titleView} />
      <Flex gap={2}>
        {showFilterButton && (
          <SimpleButtonIcon
            icon={FilterBlueIcon}
            secondary
            onClick={onOpenFilers}
          />
        )}
        {showSearchButton && (
          <InputIcon
            Icon={SearchIcon}
            placeholder={searchTitle}
            width="700px"
            onKeyPress={onKeyPress}
            onChange={onChange}
          />
        )}
        {showCreateButton && (
          <Button text={textButton} secondary onClick={onOpen} />
        )}
        {showExcelButton && (
          <Button
            text={"Exporta a Excel"}
            onClick={onClickExcel}
            secondary
            isLoading={loadingExcel}
          />
        )}
      </Flex>
    </Flex>
  );
};

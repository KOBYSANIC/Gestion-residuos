import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Flex,
  Image,
} from "@chakra-ui/react";
import React from "react";
import { WarningIcon } from "../../../Utils/icons";
import Button from "../../Buttons/Button";
import TextContent from "../../Texts/TextContent";
import Title from "../../Texts/Title";

const ModalAlert = ({
  subTitleText,
  description,
  emphasisDescription,
  isOpen,
  onClose,
  onContinue,
  children,
  onSubmit,
}) => {
  return (
    <>
      <AlertDialog
        motionPreset="slideInBottom"
        // leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
        size={{ base: "full", md: "2xl" }}
      >
        <AlertDialogOverlay
          bg="rgba(255, 255, 255, 0.055)"
          backdropFilter="auto"
          backdropBlur="3px"
        />

        <AlertDialogContent
          py="14"
          px={{ base: "5", md: "8" }}
          bg="brand.black_light"
        >
          <AlertDialogHeader
            display="flex"
            flexDirection="column"
            alignItems="center"
            mb="8"
          >
            <Flex justifyContent="center" gap="5">
              <Image src={WarningIcon} alt="warning-icon" />
              <Title content="¡Atencion!" />
            </Flex>
            <TextContent content={subTitleText} />
          </AlertDialogHeader>
          {/* <AlertDialogCloseButton /> */}
          {/* <form onSubmit={onSubmit}> */}
            <AlertDialogBody minHeight="20vh">
              <TextContent>
                {description}
                <strong>{emphasisDescription}</strong>
              </TextContent>
              {children}
            </AlertDialogBody>
            <AlertDialogFooter
              display="flex"
              flexDirection={{ base: "column-reverse", md: "row" }}
              justifyContent="space-between"
              gap={{ base: 4, md: 0 }}
            >
              <Button primary onClick={onClose} text="Cancelar" />
              <Button
                secondary
                type="submit"
                text="Continuar"
                onClick={() => {
                  if (onSubmit) return;
                  onClose();
                  onContinue();
                }}
              />
            </AlertDialogFooter>
          {/* </form> */}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ModalAlert;

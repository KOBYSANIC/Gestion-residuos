import React from "react";
import { useTypeDevice } from "../../../hooks/useTypeDevice";
import WhatsAppIcon from "../../../assets/img/icons/whatsapp-icon.svg";

import {
  Flex,
  Image,
  Modal as ChakraModal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
} from "@chakra-ui/react";
import Title from "../../Texts/Title";
import Button from "../../Buttons/Button";

const Modal = ({
  children,
  titleModal,
  isOpen,
  onClose,
  textButtonClose = "Cancelar",
  textButtonSubmit = "Aplicar filtros",
  loadingButtonSubmit = false,
  imageIconTitle = null,
  imageHeader = null,
  extraHeader = null,
  onSubmitButton = true,
  loading = false,
  isCentered = true,
  whatsAppLink = false,
  whatsAppNumber,
  titleModal2,
  blank = false,
}) => {
  const { isMobile } = useTypeDevice();

  const chatWhatsApp = () => {
    window.open(`https://wa.me/+502${whatsAppNumber}`, "_blank");
  };
  return (
    <ChakraModal
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: "full", md: "6xl" }}
      isCentered={isCentered ? !isMobile : false}
      scrollBehavior={"inside"}
    >
      <ModalOverlay
        bg="rgba(255, 255, 255, 0.055)"
        backdropFilter="auto"
        backdropBlur="3px"
      />
      <ModalContent
        paddingTop={3}
        paddingBottom={5}
        paddingX={5}
        bg="brand.black_light"
      >
        <ModalHeader>
          {imageHeader && (
            <Skeleton
              isLoaded={!loading}
              height="100%"
              width="100%"
              borderRadius="10px"
              startColor="brand.gray2"
              endColor="brand.disabled"
            >
              {(blank && (
                <a href={imageHeader} target="_blank" rel="noreferrer">
                  <Image
                    src={imageHeader}
                    width="100%"
                    height="380px"
                    objectFit="cover"
                    borderRadius="10px"
                    mb="3"
                  />
                </a>
              )) || (
                <Image
                  src={imageHeader}
                  width="100%"
                  height="380px"
                  objectFit="cover"
                  borderRadius="10px"
                  mb="3"
                />
              )}
            </Skeleton>
          )}
          <Skeleton
            isLoaded={!loading}
            height="100%"
            width="100%"
            borderRadius="10px"
            startColor="brand.gray2"
            endColor="brand.disabled"
          >
            <Flex alignItems="center" justifyContent="space-between">
              {imageIconTitle && <Image src={imageIconTitle} width="40px" />}
              <Title
                fontWeight="semibold"
                content={titleModal}
                sizeBase="3xl"
                smBase="4xl"
              />
              {titleModal2 && (
                <Title
                  fontWeight="semibold"
                  content={titleModal2}
                  sizeBase="3xl"
                  smBase="4xl"
                />
              )}
            </Flex>
            {extraHeader && extraHeader}
          </Skeleton>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>

        <ModalFooter
          display="flex"
          flexDirection={{ base: "column-reverse", md: "row" }}
          justifyContent={onSubmitButton ? "space-between" : "flex-end"}
          mt="6"
          gap={{ base: 4, md: 0 }}
        >
          {whatsAppLink && whatsAppNumber && (
            <Button
              mr="5"
              primary
              icon={WhatsAppIcon}
              text={"Abrir chat"}
              onClick={chatWhatsApp}
            />
          )}
          <Button text={textButtonClose} primary onClick={onClose} />

          {onSubmitButton && (
            <Button
              text={textButtonSubmit}
              secondary
              type="submit"
              isLoading={loadingButtonSubmit}
            />
          )}
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
};

export default Modal;

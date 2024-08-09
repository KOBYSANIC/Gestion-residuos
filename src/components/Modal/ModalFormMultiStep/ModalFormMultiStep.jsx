import React, { useEffect, useState } from "react";
import { useTypeDevice } from "../../../hooks/useTypeDevice";

import {
  Box,
  Flex,
  Grid,
  Icon,
  Image,
  Modal,
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
import { Step, Steps, useSteps } from "chakra-ui-steps";
import { faExclamationCircle, faL } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextContent from "../../Texts/TextContent";

const ModalForm = ({
  titleModal,
  information = "",
  informationColor = "brand.gray_light",
  boldInformation = "",
  isOpen,
  onClose,
  handleSubmit,
  onSubmit,
  textButtonClose = "Cancelar",
  textButtonSubmit = "Guardar",
  loadingButtonSubmit = false,
  imageIconTitle = null,
  isCentered = true,
  steps = [],
  forms = [],
  initialStep = 0,
  loading = false,
  errors = {},
  notGrid = false,
  isView = false,
}) => {
  const { isMobile } = useTypeDevice();

  // hook para manejar los pasos
  const { nextStep, prevStep, reset, activeStep } = useSteps({
    initialStep: initialStep,
  });

  useEffect(() => {
    reset();
  }, [isOpen]);

  useEffect(() => {
    if (activeStep === steps.length - 1) {
      setTypeButton("submit");
    } else {
      setTypeButton("button");
    }
  }, [activeStep]);

  const [typeButton, setTypeButton] = useState("button");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: "full", md: "6xl" }}
      isCentered={isCentered === false ? isCentered : !isMobile}
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader mb={5}>
            <Flex alignItems="center" gap="3">
              {imageIconTitle && <Image src={imageIconTitle} width="40px" />}
              {!loading ? (
                <Title content={titleModal} />
              ) : (
                <Skeleton
                  height="30px"
                  width="40%"
                  startColor="brand.disabled"
                  endColor="brand.gray3"
                />
              )}
            </Flex>
            {information && (
              <Flex
                borderRadius="10px"
                border="2px dashed"
                p={"8px"}
                // borderColor={informationColor}
                borderColor="brand.gray_light"
                alignItems="center"
                gap={4}
                mb={6}
              >
                <Box color={informationColor}>
                  <FontAwesomeIcon icon={faExclamationCircle} width={"15px"} />
                </Box>
                <Flex gap={1} flexDir="column">
                  {boldInformation && (
                    <TextContent content={boldInformation} fontWeight="Bold" />
                  )}
                  <TextContent content={information} />
                </Flex>
              </Flex>
            )}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Steps
              activeStep={activeStep}
              colorScheme="green"
              width={{
                base: "100%",
                sm: `${steps.length * 45}%`,
                md: `${steps.length * 35}%`,
                lg: `${steps.length * 25}%`,
              }}
              maxW={"100%"}
              mx="auto"
              mb={{ base: "6", md: "6" }}
              sx={{
                "& .cui-steps__step-icon-container": {
                  minWidth: "40px",
                },
                "& .css-1kb78os span": {
                  color: "brand.white",
                },
              }}
            >
              {steps.map(({ label }, index) => (
                <Step label={!isMobile ? label : ""} key={index} color="red">
                  <Grid
                    {...(!notGrid && {
                      templateColumns: { base: "1fr", md: "repeat(2, 1fr)" },
                      rowGap: 8,
                      columnGap: 20,
                    })}
                  >
                    {loading ? (
                      <>
                        <Skeleton
                          height="80px"
                          boxShadow="card"
                          borderRadius="10px"
                          startColor="brand.disabled"
                          endColor="brand.gray3"
                        />
                        <Skeleton
                          height="80px"
                          boxShadow="card"
                          borderRadius="10px"
                          startColor="brand.disabled"
                          endColor="brand.gray3"
                        />
                      </>
                    ) : (
                      forms[index]
                    )}
                  </Grid>
                </Step>
              ))}
            </Steps>
          </ModalBody>

          <ModalFooter
            display="flex"
            flexDirection={{ base: "column-reverse", md: "row" }}
            justifyContent="space-between"
            mt="12"
            gap={{ base: 4, md: 0 }}
          >
            <Button
              text={activeStep !== 0 ? "Regresar" : textButtonClose}
              primary
              onClick={() => {
                if (activeStep !== 0) prevStep();
                else onClose();
              }}
            />
            {!isView ? (
              <Button
                text={
                  activeStep === steps.length - 1
                    ? textButtonSubmit
                    : "Siguiente"
                }
                key={typeButton}
                id={typeButton}
                secondary
                type={typeButton}
                onClick={async () => {
                  try {
                    await handleSubmit(() => {})();
                    if (
                      Object.keys(errors).length === 0 &&
                      activeStep !== steps.length - 1
                    ) {
                      nextStep();
                    } else if (Object.keys(errors).length === 0) {
                      reset();
                    }
                  } catch (error) {}
                }}
                isLoading={loadingButtonSubmit}
              />
            ) : (
              activeStep !== steps.length - 1 && (
                <Button
                  text={
                    activeStep === steps.length - 1
                      ? textButtonSubmit
                      : "Siguiente"
                  }
                  key={typeButton}
                  id={typeButton}
                  secondary
                  type={typeButton}
                  onClick={async () => {
                    try {
                      await handleSubmit(() => {})();
                      if (
                        Object.keys(errors).length === 0 &&
                        activeStep !== steps.length - 1
                      ) {
                        nextStep();
                      } else if (Object.keys(errors).length === 0) {
                        reset();
                      }
                    } catch (error) {}
                  }}
                  isLoading={loadingButtonSubmit}
                />
              )
            )}
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ModalForm;

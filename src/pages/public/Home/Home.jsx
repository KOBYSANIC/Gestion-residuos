import {
  Box,
  Flex,
  Heading,
  Image,
  Skeleton,
  VStack,
  Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import {
  getAllCarrusels,
  selectALlCarrusels,
  selectLoadingCarrusels,
} from "../../../redux/features/carruselSlice";
import { useDispatch, useSelector } from "react-redux";

import { FaTree } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaCloudSun } from "react-icons/fa";
import { CheckIcon } from "@chakra-ui/icons";
import Footer from "./Footer";
import NavBarHome from "./NavBarHome";

const Home = () => {
  const dispatch = useDispatch();

  const loading = useSelector(selectLoadingCarrusels);
  const carusellData = useSelector(selectALlCarrusels);

  useEffect(() => {
    dispatch(getAllCarrusels({}));
  }, [dispatch]);
  return (
    <>
      <NavBarHome />
      <Skeleton
        isLoaded={!loading}
        width="100%"
        startColor="brand.gray"
        endColor="brand.disabled"
        maxH={{ base: "300px", md: "600px" }}
        minH={{ base: "300px", md: "600px" }}
      >
        <AliceCarousel
          mouseTracking
          autoPlay
          infinite
          autoPlayInterval={3000}
          disableButtonsControls
        >
          {carusellData.map((item, index) => {
            return (
              <Image
                key={index}
                src={item?.imagen_carrusel?.[0]}
                alt="..."
                w="full"
                maxH={{ base: "300px", md: "600px" }}
                minH={{ base: "300px", md: "600px" }}
                fit="cover"
                draggable={false}
              />
            );
          })}
        </AliceCarousel>
      </Skeleton>
      <Box pt={20} pb={12}>
        <VStack spacing={2} textAlign="center">
          <Heading as="h1" fontSize="4xl">
            <Flex justifyContent="center">
              Plans <Text color="green">&nbsp;that&nbsp;</Text> fit your need
            </Flex>
            <Flex justifyContent="center">otro texto</Flex>
          </Heading>
          <Text fontSize="lg" color={"gray.100"}>
            Start with 14-day free trial. No credit card needed. Cancel at
            anytime.
          </Text>
        </VStack>
        <Flex justifyContent="center" mt={6} gap={16} flexWrap="wrap">
          <Flex
            flexDirection="column"
            borderRadius={"50px"}
            bgColor="green.600"
            minW={"250px"}
            minH={"200px"}
            w="250px"
            alignItems="center"
            justifyContent="center"
            gap={2}
            p={6}
          >
            <Box color="green.900">
              <FaTree size={"70px"} />
            </Box>
            <Text fontSize="xl" fontWeight="bold">
              CARD 1
            </Text>
            <Text fontSize="lg" textAlign="center" color={"gray.100"}>
              Start with 14-day free trial. No credit card needed. Cancel at
              anytime.
            </Text>
          </Flex>
          <Flex
            flexDirection="column"
            borderRadius={"50px"}
            bgColor="orange.600"
            minW={"250px"}
            w="250px"
            minH={"200px"}
            alignItems="center"
            justifyContent="center"
            gap={2}
            p={6}
          >
            <Box color="orange.900">
              <FaTrash size={"70px"} />
            </Box>
            <Text fontSize="xl" fontWeight="bold">
              CARD 2
            </Text>
            <Text fontSize="lg" textAlign="center" color={"gray.100"}>
              Start with 14-day free trial. No credit card needed. Cancel at
              anytime.
            </Text>
          </Flex>
          <Flex
            flexDirection="column"
            borderRadius={"50px"}
            bgColor="yellow.600"
            minW={"250px"}
            minH={"200px"}
            w="250px"
            alignItems="center"
            justifyContent="center"
            gap={2}
            p={6}
          >
            <Box color="yellow.800">
              <FaCloudSun size={"70px"} />
            </Box>
            <Text fontSize="xl" fontWeight="bold">
              CARD 3
            </Text>
            <Text fontSize="lg" textAlign="center" color={"gray.100"}>
              Start with 14-day free trial. No credit card needed. Cancel at
              anytime.
            </Text>
          </Flex>
        </Flex>
      </Box>
      <Flex
        py={12}
        justifyContent="center"
        flexWrap={{ base: "wrap", md: "nowrap" }}
      >
        <Box maxW={"900px"} p={4} w="full">
          <Heading as="h1" fontSize="4xl">
            <Flex>
              Plans <Text color="green">&nbsp;that&nbsp;</Text> fit your need
            </Flex>
            <Flex>otro texto</Flex>
          </Heading>
          <Text fontSize="lg" color={"gray.400"}>
            Start with 14-day free trial. No credit card needed. Cancel at
            anytime.asdf
          </Text>

          <Flex mt={16} flexDirection="column" gap={4}>
            <Flex>
              <Flex
                borderRadius={"50%"}
                bgColor="green.600"
                w={"20px"}
                h={"20px"}
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={4}
              >
                <CheckIcon color="white" />
              </Flex>
              <Text fontSize="lg" color="gray.100" ml={4}>
                Start with 14-day free trial. No credit card needed. Cancel at
                anytime.
              </Text>
            </Flex>

            <Flex>
              <Flex
                borderRadius={"50%"}
                bgColor="green.600"
                w={"20px"}
                h={"20px"}
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={4}
              >
                <CheckIcon color="white" />
              </Flex>
              <Text fontSize="lg" color="gray.100" ml={4}>
                Start with 14-day free trial. No credit card needed. Cancel at
                anytime.
              </Text>
            </Flex>

            <Flex>
              <Flex
                borderRadius={"50%"}
                bgColor="green.600"
                w={"20px"}
                h={"20px"}
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={4}
              >
                <CheckIcon color="white" />
              </Flex>
              <Text fontSize="lg" color="gray.100" ml={4}>
                Start with 14-day free trial. No credit card needed. Cancel at
                anytime.
              </Text>
            </Flex>

            <Flex>
              <Flex
                borderRadius={"50%"}
                bgColor="green.600"
                w={"20px"}
                h={"20px"}
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={4}
              >
                <CheckIcon color="white" />
              </Flex>
              <Text fontSize="lg" color="gray.100" ml={4}>
                Start with 14-day free trial. No credit card needed. Cancel at
                anytime.
              </Text>
            </Flex>
          </Flex>
        </Box>
        <Image
          src="https://img.freepik.com/free-photo/vertical-shot-beautiful-mountain-valley-with-green-trees-covered-mild-fog_181624-5095.jpg?t=st=1722045419~exp=1722049019~hmac=197b2f6606f1ba08368fb638634c8509c80752beffaab6efb80344df58352d48&w=740"
          width="400px"
          borderRadius="20px"
          border="4px solid"
          borderColor="gray.500"
          draggable={false}
        />
      </Flex>
      <Footer />
    </>
  );
};

export default Home;

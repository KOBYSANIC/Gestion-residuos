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


import { FaArrowAltCircleDown } from "react-icons/fa";
import { GiWaterRecycling } from "react-icons/gi";
import { MdOutlineRecycling } from "react-icons/md";
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
              Guía de las <Text color="green">&nbsp;3R's&nbsp;</Text> para tu organización
            </Flex>
          <Flex justifyContent="center">y/o hogar</Flex>
          </Heading>
          <Text fontSize="lg" color={"gray.100"}>
            Las tres erres (3R) es una regla para cuidar el medio ambiente, específicamente
            para reducir el volumen de residuos o basura generada. Esta regla debe estar incluida en el decálogo 
            de la empresa socialmente responsable.
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
              <FaArrowAltCircleDown size={"70px"}/>
            </Box>
            <Text fontSize="xl" fontWeight="bold">
              Reducir
            </Text>
            <Text fontSize="lg" textAlign="center" color={"gray.100"}>
              Trata de reducir o simplificar el consumo de los productos directo, o sea, todo aquello que se compra y se consume. 
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
              <GiWaterRecycling size={"70px"} />
            </Box>
            <Text fontSize="xl" fontWeight="bold">
              Reutilizar
            </Text>
            <Text fontSize="lg" textAlign="center" color={"gray.100"}>
              Se refiere a poder volver a utilizar las cosas y darles la mayor utilidad posible andes de desahacernos de ellas.
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
              <MdOutlineRecycling size={"70px"} />
            </Box>
            <Text fontSize="xl" fontWeight="bold">
              Reciclar
            </Text>
            <Text fontSize="lg" textAlign="center" color={"gray.100"}>
              Consiste en el proceso de someter los materiales a un proceso en el cual puedan volver a utilizar.
            </Text>
          </Flex>
        </Flex>
      </Box>
      <Flex
        py={12}
        justifyContent="center"
        flexWrap={{ base: "wrap", md: "nowrap" }}
      >
        <Box maxW={"800px"} p={4} w="full">
          <Heading as="h1" fontSize="4xl">
            <Flex>
              Recomendaciones para<Text color="green">&nbsp;Reducir&nbsp;</Text> el 
              uso </Flex>
            <Flex>de bolsas plásticas</Flex>
          </Heading>
          <Text fontSize="lg" color={"gray.400"}>
          10% de las bolsas terminan en las costas, y en general despiden tóxicos que 
          contaminan a la gente que maneja la basura, a los que las consumen, y a futuras generaciones.
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
                Cuando vayas a la tienda y compres dos o tres productos que bien te puedes llevar con la mano, NO aceptes bolsas de plástico.
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
                Trata de llevar tus propias bolsas de tela.
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
                Si requieres una bolsa de plástico (puede ser de las de DHL o cualquier otra), pregunta en recepción.
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
                Si ya no vas a usar una bolsa, déjala de igual manera en recepción.
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
                No debe de haber ninguna bolsa en el bote de basura personal.
              </Text>
            </Flex>
          </Flex>
        </Box>
        <Image
          src="https://img.freepik.com/fotos-premium/iniciativa-comunitaria-reciclajeen-iniciativa-viajes-sostenibles-son-sostenibles_1010572-23762.jpg?w=740"
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

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  FormLabel,
  Grid,
  Image,
  Skeleton,
} from "@chakra-ui/react";
import React from "react";
import InputFormValidation from "../../../../../../../components/Inputs/InputFormValidation/InputFormValidation";
import TextContent from "../../../../../../../components/Texts/TextContent";
import { faCoins, faHashtag } from "@fortawesome/free-solid-svg-icons";
import useGetCollection from "../../../../../../../hooks/useGetCollection";
import Table from "../../../../../../../components/Table";
import { columns } from "./columns";
import useColumns from "../../../../../../../hooks/useColumns";

const DatosTransferencia = ({ orderSelected, register, errors }) => {
  const metodo_pago = orderSelected?.metodo_pago?.metodo_pago;

  const { dataCollection, loading } = useGetCollection("monedas");

  const columnsRender = useColumns(columns());

  const dataConvert = dataCollection.map((item) => {
    const precioConverted = item.conversion * orderSelected?.totales?.total;
    const precioNormal = orderSelected?.totales?.total;

    return {
      precio: precioConverted.toFixed(3),
      precio_normal: precioNormal,
      siglas_moneda_conversion: item.siglas_moneda_conversion,
    };
  });
  return (
    <Box>
      <Box as="span" flex="1" textAlign="left" fontWeight="bold" fontSize="2xl">
        Método de pago
      </Box>
      <Flex gap="3">
        <TextContent fontWeight="bold">Pais:</TextContent>
        <TextContent opacity="0.8">
          {orderSelected?.metodo_pago?.pais || "Sin información"}
        </TextContent>

        <TextContent fontWeight="bold">Porcentaje Comisión:</TextContent>
        <TextContent opacity="0.8">
          {`${orderSelected?.metodo_pago?.porcentaje_comision || "0"}%`}
        </TextContent>

        <TextContent fontWeight="bold">Método de pago:</TextContent>
        <TextContent opacity="0.8">
          {orderSelected?.metodo_pago?.metodo_pago?.nombre_banco ||
            "Sin información"}
        </TextContent>
      </Flex>
      <Box
        my={4}
        borderColor="brand.gray_light"
        px={2}
        py={2}
        borderWidth="1px"
        borderStyle="dashed"
        rounded="md"
      >
        <Accordion allowToggle>
          <AccordionItem border="none">
            <AccordionButton p="0" m="0">
              <Box as="span" flex="1" textAlign="left">
                Información de la cuenta proporcioanda
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel color="brand.white" p="0" m="0" mt={2}>
              <Grid
                gap={2}
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
              >
                {metodo_pago?.correo_electronico &&
                  metodo_pago?.tipo_banco?.value === "Virtual" && (
                    <Flex gap={3}>
                      <TextContent fontWeight="bold">
                        Correo electrónico:
                      </TextContent>
                      <TextContent opacity="0.8">
                        {metodo_pago?.correo_electronico || "Sin información"}
                      </TextContent>
                    </Flex>
                  )}

                {metodo_pago?.usuario_banco && (
                  <Flex gap={3}>
                    <TextContent fontWeight="bold">Nombre Usuario:</TextContent>
                    <TextContent opacity="0.8">
                      {metodo_pago?.usuario_banco || "Sin información"}
                    </TextContent>
                  </Flex>
                )}

                {metodo_pago?.tipo_banco?.value === "Fisico" && (
                  <>
                    {metodo_pago?.nombre_titular && (
                      <Flex gap={3}>
                        <TextContent fontWeight="bold">
                          Nombre titular de la cuenta:
                        </TextContent>
                        <TextContent opacity="0.8">
                          {metodo_pago?.nombre_titular || "Sin información"}
                        </TextContent>
                      </Flex>
                    )}

                    {metodo_pago?.numero_teléfono && (
                      <Flex gap={3}>
                        <TextContent fontWeight="bold">
                          Número de teléfono:
                        </TextContent>
                        <TextContent opacity="0.8">
                          {metodo_pago?.numero_teléfono || "Sin información"}
                        </TextContent>
                      </Flex>
                    )}

                    {metodo_pago?.numero_banco && (
                      <Flex gap={3}>
                        <TextContent fontWeight="bold">
                          Número cuenta:
                        </TextContent>
                        <TextContent opacity="0.8">
                          {metodo_pago?.numero_banco || "Sin información"}
                        </TextContent>
                      </Flex>
                    )}

                    {metodo_pago?.documento_identidad && (
                      <Flex gap={3}>
                        <TextContent fontWeight="bold">
                          Documento de identidad:
                        </TextContent>
                        <TextContent opacity="0.8">
                          {metodo_pago?.documento_identidad ||
                            "Sin información"}
                        </TextContent>
                      </Flex>
                    )}
                  </>
                )}
              </Grid>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
      <Box borderBottom="1px solid" borderColor="gray" my={8} />
      <Box as="span" flex="1" textAlign="left" fontWeight="bold" fontSize="2xl">
        Datos de la transferencia
      </Box>
      <Grid gap={6} templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}>
        <InputFormValidation
          Icon={faHashtag}
          label={"Número de referencia"}
          placeholder={"Escribe aquí el número de referencia del pago"}
          errors={errors}
          register={register}
          key_name={"referencia_pago"}
          required={false}
          disabled
        />

        <InputFormValidation
          Icon={faCoins}
          label={"Monto transferido"}
          placeholder={"Escribe aquí el monto transferido"}
          errors={errors}
          register={register}
          key_name={"monto_transferido"}
          required={false}
          minLength={1}
          disabled
        />

        <InputFormValidation
          Icon={faCoins}
          label={"Comentario"}
          placeholder={"Sin comentarios"}
          errors={errors}
          register={register}
          key_name={"comentario"}
          required={false}
          disabled
        />

        <Flex flexDir="column">
          <FormLabel>Imagen del comprobante de pago</FormLabel>
          {orderSelected?.imagen_banco?.[0] ? (
            <Box
              borderColor="brand.gray_light"
              borderWidth="1px"
              borderStyle="dashed"
              rounded="md"
              as="a"
              href={orderSelected?.imagen_banco?.[0]}
              target="_blank"
            >
              <Image
                src={orderSelected?.imagen_banco?.[0]}
                w="full"
                marginX="auto"
                objectFit="cover"
                borderRadius="5px"
                maxW="300px"
              />
            </Box>
          ) : (
            "Sin imagen"
          )}
        </Flex>
      </Grid>
      <Flex gap="1" flexDirection="column" mt={4}>
        <Flex gap="2">
          <TextContent fontWeight="bold" fontSize="2xl">
            Total a pagar:
          </TextContent>
          <TextContent opacity="0.8" fontSize="2xl">
            {`${orderSelected?.totales?.total || "0.00"} USD`}
          </TextContent>
        </Flex>
      </Flex>

      <Accordion
        allowMultiple
        gridColumn={{ base: "1 / -1", md: "span 2" }}
        borderWidth="0"
        borderColor="brand.black_light"
      >
        <AccordionItem>
          <AccordionButton padding="0" margin={0}>
            <Box as="span" flex="1" textAlign="left">
              Conversión de monedas (la tasa de cambio no es fija por lo que la
              conversión puede variar)
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel
            padding="0"
            margin={0}
            mt={4}
            color="brand.gray_light"
          >
            {loading ? (
              <Skeleton
                height="80px"
                boxShadow="card"
                borderRadius="10px"
                startColor="brand.disabled"
                endColor="brand.gray3"
              />
            ) : (
              <Table columns={columnsRender} data={dataConvert} />
            )}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default DatosTransferencia;

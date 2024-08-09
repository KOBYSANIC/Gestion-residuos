import React from "react";
import InputSelect from "../../../../../components/Inputs/InputSelect";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Grid,
  Text,
} from "@chakra-ui/react";
import InputFormValidation from "../../../../../components/Inputs/InputFormValidation/InputFormValidation";
import {
  faCalendarMinus,
  faCalendarPlus,
  faMoneyBillTrendUp,
} from "@fortawesome/free-solid-svg-icons";

const Descuentos = ({
  errors,
  register,
  control,
  index,
  estado_descuento,
  fecha_inicio_descuento,
  fecha_fin_descuento,
  descuento,
  precio,
}) => {
  return (
    <>
      <InputSelect
        options={[
          { value: true, label: "Activo" },
          { value: false, label: "Inactivo" },
        ]}
        placeholder="Selecciona una opción"
        errors={errors}
        register={register}
        control={control}
        key_name={`precios.${index}.estado_descuento`}
        name_array={"estado_descuento"}
        label="Selecciona el estado del descuento"
        validation
      />
      <Accordion
        allowMultiple
        defaultIndex={[0]}
        gridColumn={{ base: "1 / -1", md: "span 2" }}
        borderWidth="0"
        borderColor="brand.black_light"
      >
        <AccordionItem>
          <AccordionButton padding="0" margin={0}>
            <Box as="span" flex="1" textAlign="left">
              Descuentos
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel padding="0" margin={0} mt={4}>
            <Grid
              templateColumns={{
                base: "1fr",
                md: "repeat(2, 1fr)",
              }}
              rowGap={8}
              columnGap={20}
            >
              {estado_descuento(`precios.${index}.estado_descuento`) ? (
                <>
                  <InputFormValidation
                    Icon={faCalendarPlus}
                    placeholder="Ingresa la fecha de inicio del descuento"
                    errors={errors}
                    register={register}
                    key_name={`precios.${index}.fecha_inicio_descuento`}
                    name_array={"fecha_inicio_descuento"}
                    label="Fecha inicio del descuento"
                    type="date"
                    max={fecha_fin_descuento}
                    required={false}
                  />

                  <InputFormValidation
                    Icon={faCalendarMinus}
                    placeholder="Ingresa la fecha de fin del descuento"
                    errors={errors}
                    register={register}
                    key_name={`precios.${index}.fecha_fin_descuento`}
                    name_array={"fecha_fin_descuento"}
                    label="Fecha final del descuento"
                    type="date"
                    min={fecha_inicio_descuento}
                    required={false}
                  />
                  <InputFormValidation
                    Icon={faMoneyBillTrendUp}
                    placeholder="Ingresa el descuento del paquete en dolares"
                    errors={errors}
                    register={register}
                    key_name={`precios.${index}.descuento`}
                    name_array={"descuento"}
                    label="Escribe el descuento del paquete en dolares"
                    type="number"
                    step="any"
                    minLength={1}
                    noScroll
                    max={precio}
                    textBottom={`Porcentaje de descuento: ${(
                      ((descuento || 0) / (precio || 0)) *
                      100
                    ).toFixed(2)}%`}
                  />
                </>
              ) : (
                <Text color="brand.gray_light">Sin descuento</Text>
              )}
            </Grid>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default Descuentos;

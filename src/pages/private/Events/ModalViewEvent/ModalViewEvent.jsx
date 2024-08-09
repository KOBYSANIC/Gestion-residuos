import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../../components/Modal/Modal/Modal";
import {
  onCloseModal,
  selectModalEvent,
} from "../../../../redux/features/modalEventSlice";
import EventDefaultBaner from "../../../../assets/img/img/event_default_baner.png";
import {
  selectEventDataUpdate,
  selectLoadingUpdateEvent,
} from "../../../../redux/features/eventSlice";
import TextContent from "../../../../components/Texts/TextContent";
import { Flex, Skeleton } from "@chakra-ui/react";
import BadgeStateEvent from "../../../../components/Badge/BadgeStateEvent";
import Badge from "../../../../components/Badge/Badge";
import { formatCurrency } from "../../../../Utils/currency";
import moment from "moment";

const ModalViewEvent = () => {
  const dispatch = useDispatch();

  const eventSelected = useSelector(selectEventDataUpdate);
  const loading = useSelector(selectLoadingUpdateEvent);

  const onClose = () => dispatch(onCloseModal());
  const isOpen = useSelector(selectModalEvent);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      imageHeader={
        (eventSelected &&
          eventSelected.event_images &&
          eventSelected.event_images[0]) ||
        EventDefaultBaner
      }
      blank={
        eventSelected &&
        eventSelected.event_images &&
        eventSelected.event_images[0]
      }
      titleModal={eventSelected ? eventSelected.event_name : "Evento"}
      extraHeader={
        <>
          <BadgeStateEvent
            state_event={eventSelected ? eventSelected.event_state : 0}
          />
          {eventSelected?.is_pay_on_site === 1 && (
            <Badge
              textContent={"Pago contra entrega"}
              ml={6}
              animation
              colorScheme={"yellow"}
            />
          )}
        </>
      }
      onSubmitButton={false}
      textButtonClose="Cerrar"
      loading={loading}
    >
      <Skeleton
        isLoaded={!loading}
        height="100%"
        width="100%"
        borderRadius="10px"
        startColor="brand.gray2"
        endColor="brand.disabled"
      >
        <TextContent>
          {eventSelected ? eventSelected.event_description : "Descripcion"}
        </TextContent>

        <Flex gap="7" mt="5">
          <Flex gap="3">
            <TextContent>Fecha: </TextContent>
            <TextContent>
              {eventSelected ? eventSelected.event_start_date : "Fecha"}
            </TextContent>
          </Flex>

          <Flex gap="3">
            <TextContent>Hora: </TextContent>
            <TextContent>
              {eventSelected
                ? moment(eventSelected.event_start_time, "HH:mm").format(
                    "hh:mm A"
                  )
                : "Hora"}
            </TextContent>
          </Flex>
        </Flex>
        {eventSelected?.is_pay_on_site === 1 && (
          <Flex gap="3" mt={"15px"}>
            <TextContent fontSize={"25px"} fontWeight="bold">
              Monto a cobrar:
            </TextContent>
            <TextContent fontSize={"25px"} fontWeight="bold">
              {formatCurrency(eventSelected?.amount_collected) || "Sin monto"}
            </TextContent>
            <Badge
              textContent={""}
              mt={"11px"}
              animation
              colorScheme={"yellow"}
              content={false}
            />
          </Flex>
        )}
      </Skeleton>
    </Modal>
  );
};

export default ModalViewEvent;

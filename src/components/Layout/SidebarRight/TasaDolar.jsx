import React, { useState, useEffect } from "react";
import { Box, Text, Flex } from "@chakra-ui/react";
import Button from "../../Buttons/Button";
import { RepeatIcon } from "@chakra-ui/icons";
import { getDocs, collection, query, where, limit } from "firebase/firestore";
import { db } from "../../../firebase/config";

const DollarRateBox = () => {
  const [dollarRate, setDollarRate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const monedasCollection = collection(db, "monedas");
      const q = query(
        monedasCollection,
        where("active", "==", true),
        where("nombre_moneda_conversion", "==", "Bolivar"),
        limit(1)
      );

      const monedasSnapshot = await getDocs(q);

      if (!monedasSnapshot.empty) {
        const data = monedasSnapshot.docs[0].data();
        setDollarRate(data.conversion);
      }
    } catch (error) {
      console.error("Error fetching dollar exchange rate:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchData();
  };

  return (
    <Box mt="auto" w="full">
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <Box bg="brand.white" p="2" borderRadius="md" mb="3">
            <Text fontWeight="medium" fontSize="lg" color="black">
              Tasa del dólar: {dollarRate ? `${dollarRate} Bs` : "N/A"}
            </Text>
          </Box>
          <Flex justifyContent="space-between" alignItems="center">
            <Button
              text="Cambiar"
              width="45%"
              secondary
              href="/app/conf_financiera/conversion_monedas"
            />
            <Button
              text={<RepeatIcon />}
              secondary
              onClick={handleRefresh}
              width="45%"
            />
          </Flex>
        </>
      )}
    </Box>
  );
};

export default DollarRateBox;

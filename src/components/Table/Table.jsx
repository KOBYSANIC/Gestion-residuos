import React from "react";

import {
  Box,
  Fade,
  Flex,
  Skeleton,
  Table as ChakraTable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import { useTable } from "react-table";

import Button from "../Buttons/Button";
import TextContent from "../Texts/TextContent";

const Table = ({
  data,
  columns,
  page,
  loading,
  prevPageTable,
  nextPageTable,
  isSubModuleLoading = false,
}) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <>
      {loading ? (
        <>
          <Fade in={loading}>
            <Skeleton
              boxShadow="card"
              borderRadius="15px"
              startColor="brand.gray"
              endColor="brand.gray_light"
            >
              <Box height="5vh" mb={2}></Box>
            </Skeleton>
            <Skeleton
              boxShadow="card"
              borderRadius="15px"
              flex={1}
              startColor="brand.gray"
              endColor="brand.gray_light"
            >
              <Box height={isSubModuleLoading ? "60vh" : "68vh"}></Box>
            </Skeleton>
          </Fade>
        </>
      ) : (
        <Box
          overflowX="auto"
          position="relative"
          height={{
            base: "calc(100% - 109px)",
            sm: "calc(100% - 125px)",
            md: "calc(100% - 120px)",
            lg: "calc(100% - 70px)",
          }}
        >
          <Fade
            in={!loading}
            transition={{ enter: { duration: 1 }, exit: { duration: 1 } }}
          >
            <ChakraTable {...getTableProps()}>
              <Thead
                position="sticky"
                top="0px"
                bg="brand.black_light"
                zIndex="2"
                borderBottom="2px solid"
                borderColor="brand.gray_semilight"
                h="60px"
              >
                {headerGroups.map((headerGroup) => (
                  <Tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <Th
                        color={"brand.white"}
                        fontWeight="bold"
                        textTransform="inherit"
                        {...column.getHeaderProps()}
                        borderColor="transparent"
                      >
                        {column.render("Header")}
                      </Th>
                    ))}
                  </Tr>
                ))}
              </Thead>

              {/* CUANDO NO HAY DATOS */}
              {rows.length === 0 && (
                <Tbody>
                  <Tr>
                    <Td
                      colSpan={columns.length}
                      textAlign="center"
                      borderColor="brand.gray"
                      h="67px"
                    >
                      <TextContent>No hay datos</TextContent>
                    </Td>
                  </Tr>
                </Tbody>
              )}

              <Tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <Tr
                      color="brand.white"
                      {...row.getRowProps()}
                      _hover={{ bg: "brand.gray" }}
                      fontSize={"sm"}
                    >
                      {row.cells.map((cell) => {
                        return (
                          <Td
                            {...cell.getCellProps()}
                            borderColor="brand.gray"
                            h="67px"
                          >
                            {cell.render("Cell")}
                          </Td>
                        );
                      })}
                    </Tr>
                  );
                })}
              </Tbody>
            </ChakraTable>

            {page && (
              <Flex
                justifyContent="space-between"
                alignItems="center"
                position="sticky"
                bottom="0"
                bg="brand.black_light"
                p={2}
              >
                <TextContent fontWeight="bold" mt="3">
                  Página {page}
                </TextContent>
                <Flex justifyContent="flex-end" mt="3">
                  <Button
                    text="ant."
                    outline
                    width="50px"
                    onClick={prevPageTable}
                    disabled={page <= 1}
                    mr="3"
                  />
                  <Button
                    text="sig."
                    outline
                    width="50px"
                    onClick={nextPageTable}
                    disabled={data.length < 10}
                  />
                </Flex>
              </Flex>
            )}
          </Fade>
        </Box>
      )}
    </>
  );
};

export default Table;

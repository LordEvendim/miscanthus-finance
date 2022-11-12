import {
  Container,
  Box,
  Heading,
  Grid,
  GridItem,
  Flex,
  Spacer,
  Link,
} from "@chakra-ui/react";
import React from "react";
import { contractAddresses } from "../../constants/contracts";
import { currentNetwork } from "../../constants/networks";
import { tokenSymbols } from "../../constants/tokenSymbols";

interface ContractsProps {}

export const Contracts: React.FC<ContractsProps> = () => {
  return (
    <Container w={"full"} centerContent>
      <Box h={"10"} />
      <Box w={"container.xl"}>
        <Heading mb={"4"}>Contracts</Heading>
        <Box h={"2"} />
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <GridItem w="100%" minH="100" bg="gray.100" rounded="md" p={4}>
            <Heading size={"sm"} color={"gray.600"} mb={"4"}>
              Core contracts
            </Heading>
            <Box
              border={"1px"}
              borderColor={"gray.200"}
              bgColor={"white"}
              p={4}
              rounded={"md"}
            >
              <Flex>
                <Link>Miscanthus Core</Link>
                <Spacer></Spacer>
                <Link mr={2}>{contractAddresses[currentNetwork].CORE}</Link>
              </Flex>
            </Box>
          </GridItem>
          <GridItem w="100%" minH="100" bg="gray.100" rounded="md" p={4}>
            <Heading size={"sm"} color={"gray.600"} mb={"4"}>
              Used 3rd party contracts
            </Heading>
            <Box
              border={"1px"}
              borderColor={"gray.200"}
              bgColor={"white"}
              p={4}
              rounded={"md"}
            >
              <Flex>
                <Link>{tokenSymbols.STABLE}</Link>
                <Spacer></Spacer>
                <Link mr={2}>
                  {contractAddresses[currentNetwork].STABLECOIN}
                </Link>
              </Flex>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </Container>
  );
};

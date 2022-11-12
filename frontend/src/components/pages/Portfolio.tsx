import {
  Box,
  Heading,
  Grid,
  Button,
  GridItem,
  HStack,
  Text,
  Container,
  VStack,
  Flex,
  SimpleGrid,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { tokenSymbols } from "../../constants/tokenSymbols";
import { useContracts } from "../../stores/useContracts";
import { usePortfolio } from "../../stores/usePortfolio";
import { BoughtContractItem } from "../BoughtContractItem";
import { WrittenContractItem } from "../WrittenContractItem";

interface PortfolioProps {}

export const Portfolio: React.FC<PortfolioProps> = () => {
  let navigate = useNavigate();
  const core = useContracts((state) => state.core);

  const userPositions = usePortfolio((state) => state.userHoldings);
  const writtenContracts = usePortfolio((state) => state.writtenContracts);
  const createdContractsValue = usePortfolio(
    (state) => state.createdContractsValue
  );
  const ownedContractsValue = usePortfolio(
    (state) => state.ownedContractsValue
  );
  const readyToSettleValue = usePortfolio((state) => state.readyContractsValue);

  useEffect(() => {
    if (!core) return;

    console.log("fetching holdings");
    usePortfolio.getState().fetchPortfolio();
  }, [core]);

  return (
    <Container w={"full"} centerContent>
      <Box h={"10"} />
      <Box w={"1500px"}>
        <HStack>
          <Button
            variant={"solid"}
            mr={"5px"}
            onClick={() => {
              navigate("/trade");
            }}
          >
            <AiOutlineArrowLeft></AiOutlineArrowLeft>
          </Button>
          <Heading mb={"4"}>Portfolio</Heading>
        </HStack>
        <Box h={"12"} />
        <Grid templateColumns="repeat(4, 1fr)" gap={12}>
          <GridItem colSpan={1}>
            <Text fontWeight={"bold"} fontSize={"2xl"} mb={"20px"}>
              Statistics
            </Text>
            <GridItem
              padding={"20px"}
              boxShadow={"lg"}
              borderRadius={"20px"}
              border={"1px"}
              borderColor={"gray.200"}
              background={"white"}
            >
              <Heading size={"sm"} color={"gray.600"} mb={"8"}>
                Total value
              </Heading>
              <VStack alignItems={"flex-start"} gap={"10px"}>
                <Flex width={"full"} justifyContent={"space-between"}>
                  <Box>Created</Box>
                  <Box fontWeight={"bold"}>
                    {createdContractsValue} {tokenSymbols.STABLE}
                  </Box>
                </Flex>
                <Flex width={"full"} justifyContent={"space-between"}>
                  <Box>Owned</Box>
                  <Box fontWeight={"bold"}>
                    {ownedContractsValue} {tokenSymbols.STABLE}
                  </Box>
                </Flex>
                <Flex width={"full"} justifyContent={"space-between"}>
                  <Box>Ready to settle</Box>
                  <Box fontWeight={"bold"}>
                    {readyToSettleValue} {tokenSymbols.STABLE}
                  </Box>
                </Flex>
              </VStack>
            </GridItem>
          </GridItem>
          <GridItem colSpan={3}>
            <Text fontWeight={"bold"} fontSize={"2xl"} mb={"20px"}>
              Futures contracts
            </Text>
            <Text
              fontWeight={"bold"}
              fontSize={"xl"}
              mb={"10px"}
              ml={"10px"}
              color={"gray.600"}
            >
              Your holdings
            </Text>
            <SimpleGrid
              columns={4}
              spacing={0}
              px={"30px"}
              mb={"4"}
              color={"gray.400"}
            >
              <Text>Expiration price</Text>
              <Text>Quantity</Text>
              <Text>Expiration date</Text>
              <Box></Box>
            </SimpleGrid>
            {userPositions?.map((contract) => (
              <BoughtContractItem {...contract} />
            ))}
            <Text
              fontWeight={"bold"}
              fontSize={"xl"}
              mt={"30px"}
              mb={"10px"}
              ml={"10px"}
              color={"gray.600"}
            >
              Written contracts
            </Text>
            {writtenContracts?.map((contract) => (
              <WrittenContractItem {...contract} />
            ))}
          </GridItem>
        </Grid>
      </Box>
    </Container>
  );
};

import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  SimpleGrid,
  Spacer,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdRefresh } from "react-icons/md";
import { GrPrevious, GrNext } from "react-icons/gr";
import { BigNumber, ethers } from "ethers";
import Countdown from "react-countdown";

import { FuturesItem } from "../FuturesItem";
import { useEpoch } from "../../stores/useEpoch";
import { useCoreContract } from "../../stores/useCoreContract";
import { useUserData } from "../../stores/useUserData";
import { BalanceActionModal } from "../modals/BalanceActionModal";
import { useGenericBalanceModal } from "../../stores/useGenericBalanceModal";
import { calculatePricePerUnit } from "../../helpers/calculatePricePerUnit";
import { tokenSymbols } from "../../constants/tokenSymbols";

interface DashboardProps {}

export const Dashboard: React.FC<DashboardProps> = () => {
  let navigate = useNavigate();

  const DAY = 1000 * 60 * 60 * 24;
  const nextEpochDate = Date.now() - (Date.now() % DAY) + DAY;

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isRefreshingEpoch, setIsRefreshingEpoch] = useState<boolean>(false);

  const currentEpoch = useEpoch((state) => state.currentEpoch);
  const contracts = useCoreContract((state) => state.contracts);
  const sortedContracts = [...contracts].sort((contractA, contractB) => {
    const priceA = BigNumber.from(
      calculatePricePerUnit(contractA.contractPrice, contractA.quantity)
    );
    const priceB = BigNumber.from(
      calculatePricePerUnit(contractB.contractPrice, contractB.quantity)
    );

    return priceA.gt(priceB) ? 1 : -1;
  });

  const balance = useUserData((state) => state.balance);
  const stableBalance = useUserData((state) => state.stableBalance);
  const address = useUserData((state) => state.address);
  const openModal = useGenericBalanceModal((state) => state.openModal);

  // on initialization
  useEffect(() => {
    (async () => {
      if (address) {
        await useUserData.getState().fetchBalances();
        await useEpoch.getState().fetchCurrentEpoch();
        await useCoreContract
          .getState()
          .fetchContracts(useEpoch.getState().currentEpoch);
      }
    })();
  }, [address]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        useCoreContract
          .getState()
          .fetchContracts(useEpoch.getState().currentEpoch),
        useUserData.getState().fetchBalances(),
      ]);
    } catch (error) {}
    setIsRefreshing(false);
  };

  const resetEpoch = async () => {
    setIsRefreshingEpoch(true);
    try {
      await useEpoch.getState().fetchCurrentEpoch();
    } catch (error) {}
    setIsRefreshingEpoch(false);
  };

  return (
    <Container w={"full"} centerContent>
      <BalanceActionModal />
      <Box h={"10"} />
      <Box w={"1500px"}>
        <Flex>
          <Heading mb={"4"}>Futures</Heading>
          <Spacer />
          <HStack spacing={"20px"}>
            <Button
              onClick={() => handleRefresh()}
              color={"white"}
              bgGradient="linear(to-l, #68D391, #68D3CC)"
              isLoading={isRefreshing}
            >
              <MdRefresh color="white" size={"20px"} />
            </Button>
            <Button
              onClick={() => navigate("/create")}
              color={"white"}
              bgGradient="linear(to-l, #68D391, #68D3CC)"
            >
              + write contract
            </Button>
            <Button
              onClick={() => navigate("/portfolio")}
              color={"white"}
              bgGradient="linear(to-l, #68D391, #68D3CC)"
            >
              portfolio
            </Button>
          </HStack>
        </Flex>
        <Box h={"2"} />
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          <GridItem
            w="100%"
            minH="100"
            bg="white"
            rounded={"3xl"}
            p={"20px"}
            alignSelf={"flex-start"}
            boxShadow="0px 0px 15px rgba(0,0,0,0.1)"
          >
            <Box>
              <Heading size={"sm"} color={"gray.600"} mb={"8"}>
                Epoch options
              </Heading>
              <Grid
                templateColumns="repeat(2, 1fr)"
                alignSelf={"center"}
                justifySelf={"center"}
                mb={10}
              >
                <GridItem justifySelf={"center"}>
                  <HStack gap={"10px"}>
                    <Button
                      width={"50px"}
                      padding={"10px"}
                      borderRadius={"10px"}
                      onClick={() => {
                        useEpoch.getState().decreaseEpoch();
                      }}
                    >
                      <GrPrevious color="black" size={"14px"}></GrPrevious>
                    </Button>
                    <Button
                      variant={"ghost"}
                      fontWeight={"normal"}
                      w={"80px"}
                      isLoading={isRefreshingEpoch}
                      onClick={() => resetEpoch()}
                    >
                      Epoch {currentEpoch.toString()}
                    </Button>
                    <Button
                      width={"50px"}
                      padding={"10px"}
                      borderRadius={"10px"}
                      onClick={() => {
                        useEpoch.getState().increaseEpoch();
                      }}
                    >
                      <GrNext color="black" size={"14px"}></GrNext>
                    </Button>
                  </HStack>
                </GridItem>
                <GridItem justifySelf={"center"}>
                  <Text fontSize={"2xl"} textAlign={"center"}>
                    <Countdown
                      date={nextEpochDate}
                      daysInHours={true}
                    ></Countdown>
                  </Text>
                </GridItem>
              </Grid>
              <Heading size={"sm"} color={"gray.600"} mb={"6"}>
                Account
              </Heading>
              <Grid px={"20px"} templateColumns="repeat(2, 1fr)" mb={"10px"}>
                <Text color={"gray.500"}>balance: </Text>
                <Text fontWeight={"bold"} color={"gray.700"}>
                  {balance &&
                    balance !== "-" &&
                    ethers.utils.formatUnits(balance, 6)}{" "}
                  {tokenSymbols.NATIVE}
                </Text>
              </Grid>
              <Box mb={"16px"} ml={"20px"}>
                <Button onClick={() => openModal(true, false)} mr={"10px"}>
                  Deposit
                </Button>
                <Button onClick={() => openModal(true, true)}>Withdraw</Button>
              </Box>
              <Box h={"10px"} />
              <Grid px={"20px"} templateColumns="repeat(2, 1fr)" mb={"10px"}>
                <Text color={"gray.500"}>stablecoin balance: </Text>
                <Text fontWeight={"bold"} color={"gray.700"}>
                  {stableBalance &&
                    stableBalance !== "-" &&
                    ethers.utils.formatUnits(stableBalance, 6)}{" "}
                  {tokenSymbols.STABLE}
                </Text>
              </Grid>
              <Box mb={"16px"} ml={"20px"}>
                <Button onClick={() => openModal(false, false)} mr={"10px"}>
                  Deposit
                </Button>
                <Button onClick={() => openModal(false, true)}>Withdraw</Button>
              </Box>
            </Box>
          </GridItem>
          <GridItem colSpan={2}>
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
            {contracts.length > 0 ? (
              sortedContracts.map((contract) => (
                <FuturesItem
                  key={contract.contractId.toString()}
                  {...contract}
                ></FuturesItem>
              ))
            ) : (
              <Center marginTop={"80px"}>
                <Text fontWeight={"bold"} color={"gray.300"}>
                  {"No contracts available"}
                </Text>
              </Center>
            )}
          </GridItem>
        </Grid>
      </Box>
    </Container>
  );
};

import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  HStack,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { tokenSymbols } from "../../constants/tokenSymbols";
import { useContracts } from "../../stores/useContracts";
import { toast } from "react-toastify";
import { ethers } from "ethers";

interface FaucetProps {}

export const Faucet: React.FC<FaucetProps> = () => {
  let navigate = useNavigate();
  const [isObtaining, setIsObtaining] = useState<boolean>(false);

  const handleSubmit = async () => {
    setIsObtaining(true);
    try {
      const stable = useContracts.getState().stablecoin;

      if (!stable) {
        throw new Error("Login to your TronLink wallet");
      }

      // @ts-ignore
      const result = await stable.getTokens().send({
        feeLimit: 100_000_000,
        callValue: ethers.utils.parseUnits("1", 6),
        shouldPollResponse: false,
      });

      console.log(result);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }

      console.log(error);
    }
    setIsObtaining(false);
  };

  return (
    <Container w={"full"} centerContent>
      <Box h={"10"} />
      <Box w={"container.xl"}>
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
          <Heading mb={"4"}>Faucet</Heading>
        </HStack>
        <Box h={"12"} />
        <Grid templateColumns="repeat(2, 1fr)" gap={12}>
          <GridItem>
            <Button
              w={"full"}
              h={"50px"}
              boxShadow={"sm"}
              isLoading={isObtaining}
              color={"white"}
              bgGradient="linear(to-l, #68D391, #68D3CC)"
              onClick={() => handleSubmit()}
            >
              {`Obtain 1000 ${tokenSymbols.STABLE} ≈ 1 ${tokenSymbols.NATIVE}`}
            </Button>
          </GridItem>
          <GridItem ml={"80px"}>
            <Text fontSize={"xl"}>
              In order to let users test the application, we provide a simple
              faucet to mint stablecoin. 1000USDM tokens can be obtained for ≈1
              TRX.
            </Text>
          </GridItem>
        </Grid>
      </Box>
    </Container>
  );
};

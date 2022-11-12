import {
  Container,
  Box,
  Heading,
  Grid,
  Button,
  Divider,
  Flex,
  GridItem,
  HStack,
  Input,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { BigNumber, BigNumberish, ethers } from "ethers";
import { SubmitHandler, useForm } from "react-hook-form";
import { useCoreContract } from "../../stores/useCoreContract";

interface CreateProps {}

interface CreateForm {
  expirationPrice: string;
  contractDuration: BigNumberish;
  quantity: string;
}

export const Create: React.FC<CreateProps> = () => {
  let navigate = useNavigate();

  const { register, handleSubmit } = useForm<CreateForm>();
  const onSubmit: SubmitHandler<CreateForm> = async (data) => {
    setIsCreating(true);
    try {
      const formatedExpirationPrice = data.expirationPrice.replace(/,/g, ".");
      const formatedQuantity = data.quantity.replace(/,/g, ".");

      const expirationPriceInWei = BigNumber.from(
        ethers.utils.parseUnits(formatedExpirationPrice, 6)
      );
      const ONE_ETHER = ethers.utils.parseUnits("1", 6);
      const quantityInWei = ethers.utils.parseUnits(formatedQuantity, 6);

      //  contractValue = quantity * ratio = quantity * (price / 1 ether) = quantity * price / 1 ether
      const contractValue = quantityInWei
        .mul(expirationPriceInWei)
        .div(ONE_ETHER);

      console.log(contractValue.toString());
      console.log(ethers.utils.formatUnits(contractValue, 6));

      await useCoreContract
        .getState()
        .writeContract(quantityInWei, data.contractDuration, contractValue);
    } catch (error: any) {
      if (error instanceof Error) {
        console.log(error.message);
      }

      console.log(error);
    }
    setIsCreating(false);
  };

  const [isCreating, setIsCreating] = useState<boolean>(false);

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
          <Heading mb={"4"}>Write contract</Heading>
        </HStack>
        <Box h={"12"} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid templateColumns="repeat(2, 1fr)" gap={12}>
            <GridItem>
              <Text ml={2} mb={1} fontSize={"sm"}>
                Expiration price
              </Text>
              <Input
                backgroundColor={"white"}
                mb={6}
                {...register("expirationPrice")}
              ></Input>
              <Text ml={2} mb={1} fontSize={"sm"}>
                Contract duration (in days)
              </Text>
              <Input
                backgroundColor={"white"}
                mb={6}
                {...register("contractDuration")}
              ></Input>
              <Text ml={2} mb={1} fontSize={"sm"}>
                Quantity
              </Text>
              <Input
                backgroundColor={"white"}
                mb={6}
                {...register("quantity")}
              ></Input>
              <Button
                w={"full"}
                h={"50px"}
                boxShadow={"sm"}
                isLoading={isCreating}
                color={"white"}
                bgGradient="linear(to-l, #68D391, #68D3CC)"
                type="submit"
              >
                Create
              </Button>
            </GridItem>
            <GridItem ml={"80px"}>
              <HStack spacing={"30px"}>
                <Flex
                  justify={"center"}
                  align={"center"}
                  rounded={"full"}
                  width={"50px"}
                  height={"50px"}
                  bg={"transparent"}
                  textAlign={"center"}
                  border={"1px"}
                  borderColor={"gray.500"}
                >
                  <Text fontSize={"xl"} mb={"4px"}>
                    1
                  </Text>
                </Flex>
                <Text>Provide valid data</Text>
              </HStack>
              <Divider
                orientation="vertical"
                ml={"25px"}
                mt={"10px"}
                mb={"10px"}
                height={"90px"}
                borderColor={"gray.500"}
              />
              <HStack spacing={"30px"}>
                <Flex
                  justify={"center"}
                  align={"center"}
                  rounded={"full"}
                  width={"50px"}
                  height={"50px"}
                  bg={"transparent"}
                  textAlign={"center"}
                  border={"1px"}
                  borderColor={"gray.500"}
                >
                  <Text fontSize={"xl"} mb={"4px"}>
                    2
                  </Text>
                </Flex>
                <Text>Sign the transaction</Text>
              </HStack>
              <Divider
                orientation="vertical"
                ml={"25px"}
                mt={"10px"}
                mb={"10px"}
                height={"90px"}
                borderColor={"gray.500"}
              />
              <HStack spacing={"30px"}>
                <Flex
                  justify={"center"}
                  align={"center"}
                  rounded={"full"}
                  width={"50px"}
                  height={"50px"}
                  bg={"transparent"}
                  textAlign={"center"}
                  border={"1px"}
                  borderColor={"gray.500"}
                >
                  <Text fontSize={"xl"} mb={"4px"}>
                    3
                  </Text>
                </Flex>
                <Text>Let users fight for your NFT!</Text>
              </HStack>
            </GridItem>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

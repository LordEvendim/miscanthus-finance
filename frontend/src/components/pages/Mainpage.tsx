import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Text,
  Image,
  Flex,
  Center,
  Stack,
  Link,
} from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { BsChevronCompactDown } from "react-icons/bs";
import { AiFillPlayCircle } from "react-icons/ai";
import { FaExchangeAlt } from "react-icons/fa";

import LandingPageImage from "../../assets/landingpage-image.png";
import { LogoOutline } from "../LogoOutline";
import StationbidsLogo from "../../assets/Stationbids.png";

interface MainpageProps {}

export const Mainpage: React.FC<MainpageProps> = () => {
  const navigate = useNavigate();

  return (
    <Container w="full" centerContent>
      <Image
        zIndex={"-1"}
        src={LandingPageImage}
        position={"absolute"}
        top={0}
        left={0}
        width={"100%"}
      ></Image>
      <Box h={"100px"} w="full" />
      <Box w="container.xl">
        <Heading
          size="3xl"
          lineHeight="1.3"
          fontWeight={"extrabold"}
          color={"white"}
          textShadow={"0px 0px 15px rgba(0,0,0,0.2)"}
        >
          Trade and create expirable
          <br />
          futures contracts on{" "}
          <Button
            variant="link"
            size="3xl"
            textColor="green.300"
            fontWeight={"extrabold"}
            bgGradient="linear(to-l, #d13838, #991c1c)"
            bgClip={"text"}
          >
            Tron
          </Button>
        </Heading>
        <Text
          mt={"5px"}
          fontSize={"md"}
          fontWeight={"extrabold"}
          color={"white"}
          opacity={"0.7"}
        >
          Expirable smart contracts represented as NFT token can be used and
          traded on other protocols
        </Text>
        <Box h={12} w="full" />
        <HStack>
          <Button
            w="60"
            h="14"
            onClick={() => {
              navigate("/trade");
            }}
            color={"green.400"}
            borderWidth={"1px"}
            borderColor={"gray.200"}
            boxShadow={"lg"}
            bg={"white"}
            borderRadius={"2xl"}
            fontSize={"lg"}
          >
            Try now!
          </Button>
          <Button variant={"link"}>
            <Text
              fontSize={"xl"}
              fontWeight={"extrabold"}
              color={"#dedede"}
              ml={"40px"}
              mr={"15px"}
              mb={"5px"}
            >
              Demo
            </Text>
            <AiFillPlayCircle size={"30px"} color={"#dedede"} />
          </Button>
        </HStack>
      </Box>
      <Box h={"120px"} w="full" />
      <Center>
        <Stack align={"center"}>
          <Text fontSize="xl" fontWeight={"bold"} color={"#f0f0f0"}>
            Learn more
          </Text>
          <BsChevronCompactDown size={"40px"} color={"#f0f0f0"} />
        </Stack>
      </Center>
      <Box h={"160px"} w="full" />
      <Center>
        <HStack gap={"60px"}>
          <Box
            w={"400px"}
            h={"400px"}
            borderWidth={"2px"}
            borderColor={"gray.200"}
            borderRadius={"3xl"}
            boxShadow={"xl"}
            background={"white"}
          >
            <Flex w={"full"} height={"200px"} justifyContent={"center"}>
              <Center mt={"30px"}>
                <LogoOutline fontSize={"3xl"} />
              </Center>
            </Flex>
            <Box p={"20px"} fontWeight={"bold"} fontSize={"xl"}>
              <Link href="https://miscanthus.finance/dashboard">
                Miscanthus.finance
              </Link>
              <Text
                fontWeight={"normal"}
                fontSize={"md"}
                mt={"10px"}
                opacity={"0.6"}
              >
                Trade and write expirable futures contracts. Manage and trasfer
                your positions as they are represented as NFT tokens.
              </Text>
            </Box>
          </Box>
          <FaExchangeAlt size={"60px"} color={"#eaeaea"} />
          <Box
            w={"400px"}
            h={"400px"}
            borderWidth={"2px"}
            borderColor={"gray.200"}
            borderRadius={"3xl"}
            boxShadow={"xl"}
            background={"white"}
          >
            <Flex
              w={"full"}
              height={"200px"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Image src={StationbidsLogo} w={"250px"} mt={"30px"} />
            </Flex>
            <Box p={"20px"} fontWeight={"bold"} fontSize={"xl"}>
              <Link href={"https://stationbids.com/"}>Stationbids.com</Link>
              <Text
                fontWeight={"normal"}
                fontSize={"md"}
                mt={"10px"}
                opacity={"0.6"}
              >
                Decentralized auction house that can be used to auction and sell
                your futures contracts before the expiration date
              </Text>
            </Box>
          </Box>
        </HStack>
      </Center>
      <Box h={"120px"} w="full" />
    </Container>
  );
};

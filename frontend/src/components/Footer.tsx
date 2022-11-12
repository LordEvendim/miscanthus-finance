import {
  Box,
  Heading,
  SimpleGrid,
  VStack,
  Text,
  Flex,
  Link,
} from "@chakra-ui/react";
import React from "react";
import { Logo } from "./Logo";
import { FaDiscord, FaTwitter } from "react-icons/fa";

interface FooterProps {}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <Box
      w={"full"}
      pb={"30px"}
      pt={"15px"}
      borderTop={"1px"}
      borderColor={"gray.200"}
      bg={"white"}
    >
      <SimpleGrid w={"50%"} mx={"auto"} columns={3} spacingX="200px">
        <Box>
          <VStack alignItems={"start"} fontSize={"sm"}>
            <Box>
              <Logo fontSize={"xl"} />
              <Text mt={"10px"} opacity={"0.5"}>
                Decentralized market for expirable futures contracts on Tron.
                Join our community and leave your feedback!
              </Text>
            </Box>
          </VStack>
        </Box>
        <Box>
          <VStack alignItems={"start"} fontSize={"sm"}>
            <Heading fontSize={"sm"}>Development</Heading>
            <Text opacity={"0.5"}>Roadmap</Text>
            <Text opacity={"0.5"}>Used services</Text>
            <Text opacity={"0.5"}>About</Text>
          </VStack>
        </Box>
        <Box>
          <VStack alignItems={"start"} fontSize={"sm"}>
            <Heading fontSize={"sm"}>Community</Heading>
            <Flex alignItems={"center"} opacity={"0.5"}>
              <FaDiscord />
              <Link marginLeft={"5px"} href={""} isExternal>
                Discord
              </Link>
            </Flex>
            <Flex alignItems={"center"} opacity={"0.5"}>
              <FaTwitter />
              <Link marginLeft={"5px"} href={""} isExternal>
                Twitter
              </Link>
            </Flex>
          </VStack>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

import {
  Box,
  Button,
  CloseButton,
  Flex,
  Heading,
  HStack,
  Spacer,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { truncateAddress } from "../helpers/truncateAddress";
import { useWallet } from "../hooks/useWallet";
import { useUserData } from "../stores/useUserData";

interface NavigationBarProps {}

export const NavigationBar: React.FC<NavigationBarProps> = () => {
  const [isConnecting, connectWallet, disconnectWallet] = useWallet();
  const userAddress = useUserData((state) => state.address);

  const location = useLocation();
  const [isHomeScreen, setIsHomescreen] = useState<Boolean>(true);

  useEffect(() => {
    setIsHomescreen(location.pathname === "/" ? true : false);
  }, [location]);

  return (
    <Box w="100%">
      <Flex mx={"auto"} w="60%" py={6} alignItems="center">
        <Box>
          <Heading>
            <NavLink to={"/"}>
              <Text
                display={"inline"}
                fontSize={"xl"}
                color={isHomeScreen ? "white" : "gray.600"}
                textShadow={
                  isHomeScreen
                    ? "0px 0px 10px rgba(0,0,0,0.7)"
                    : "0px 0px 10px rgba(0,0,0,0.2)"
                }
              >
                Miscanthus
              </Text>
              <Text
                display={"inline"}
                m={"0px"}
                fontSize={"xl"}
                color={isHomeScreen ? "#adffbe" : "#68D3B6"}
                textShadow={
                  isHomeScreen
                    ? "0px 0px 10px rgba(0,0,0,0.7)"
                    : "0px 0px 10px rgba(0,0,0,0.2)"
                }
              >
                .finance
              </Text>
            </NavLink>
          </Heading>
        </Box>
        <Spacer />
        <HStack spacing="64px">
          <Button variant="link" textColor="gray.600">
            <NavLink to={"/about"}>About</NavLink>
          </Button>
          <Button variant="link" textColor="gray.600">
            <NavLink to={"/contracts"}>Contracts</NavLink>
          </Button>
          <Button variant="link" textColor="gray.600">
            <NavLink to={"/trade"}>
              <Text color={isHomeScreen ? "white" : "green.300"}>Trade</Text>
            </NavLink>
          </Button>

          {useUserData.getState().isLogged ? (
            <Box
              padding={"8px"}
              px={"15px"}
              borderRadius={"8px"}
              borderWidth={"1px"}
              borderColor={isHomeScreen ? "white" : "gray.600"}
            >
              <HStack>
                <NavLink to={"/profile"}>
                  <Text textColor={isHomeScreen ? "white" : "gray.600"}>
                    {truncateAddress(userAddress, 15)}
                  </Text>
                </NavLink>
                <CloseButton
                  onClick={disconnectWallet}
                  size="sm"
                  color={isHomeScreen ? "white" : "gray.600"}
                />
              </HStack>
            </Box>
          ) : (
            <Button
              w={130}
              h={10}
              isLoading={isConnecting}
              onClick={connectWallet}
            >
              Connect
            </Button>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

import {
  Button,
  Flex,
  Heading,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  VStack,
  Text,
} from "@chakra-ui/react";
import { BigNumber, ethers } from "ethers";
import React, { useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { toast } from "react-toastify";
import { tokenSymbols } from "../../constants/tokenSymbols";
import { useCoreContract } from "../../stores/useCoreContract";
import { useGenericBalanceModal } from "../../stores/useGenericBalanceModal";
import { useUserData } from "../../stores/useUserData";

interface BalanceActionProps {}

export const BalanceActionModal: React.FC<BalanceActionProps> = () => {
  const [value, setValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isNative = useGenericBalanceModal((state) => state.isNative);
  const isWithdrawing = useGenericBalanceModal((state) => state.isWithdrawing);
  const isOpen = useGenericBalanceModal((state) => state.isOpen);
  const onClose = useGenericBalanceModal((state) => state.onClose);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      console.log(value);
      console.log("Submitting modal");
      const formatedValue = ethers.utils.parseUnits(value, 6);

      if (isWithdrawing) {
        isNative
          ? await useCoreContract.getState().withdraw(formatedValue)
          : await useCoreContract.getState().withdrawUSD(formatedValue);
      } else {
        isNative
          ? await useCoreContract.getState().deposit(formatedValue)
          : await useCoreContract.getState().depositUSD(formatedValue);
      }
      useUserData.getState().fetchBalances();
      onClose();
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
      }

      console.log(error);
    }
    setIsLoading(false);
  };

  return (
    <Modal isOpen={isOpen} size={"2xl"} onClose={onClose}>
      <ModalOverlay />
      <ModalContent p={"30px"}>
        <Heading
          fontWeight={"semibold"}
          fontSize={"3xl"}
          textColor={"gray.600"}
          mb={"20px"}
        >
          {isWithdrawing ? "Withdraw" : "Deposit"}{" "}
          {isNative ? tokenSymbols.NATIVE : tokenSymbols.STABLE}
        </Heading>
        <VStack spacing={"10px"} align={"start"}>
          <Text>
            {isWithdrawing ? "Withdrawal" : "Deposit"}
            {" value"}
          </Text>
          <Flex w={"full"}>
            <Input
              flex={"1"}
              mr={"10px"}
              onChange={(event) => setValue(event.target.value)}
            ></Input>
            <Button
              width={"150px"}
              p={"15px"}
              onClick={() => handleSubmit()}
              isLoading={isLoading}
            >
              {isWithdrawing ? "Withdraw" : "Deposit"}
            </Button>
          </Flex>
        </VStack>

        <Text mt={"20px"} px={"10px"} color={"gray.500"}>
          <AiOutlineInfoCircle />
          <Text mt={"5px"}>Remember that transactions are irreversible!</Text>
        </Text>
      </ModalContent>
    </Modal>
  );
};

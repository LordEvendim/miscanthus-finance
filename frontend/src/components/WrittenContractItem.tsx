import { Box, Button, SimpleGrid, Text } from "@chakra-ui/react";
import { BigNumber, BigNumberish, ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { tokenSymbols } from "../constants/tokenSymbols";
import { calculatePricePerUnit } from "../helpers/calculatePricePerUnit";

import { useCoreContract } from "../stores/useCoreContract";
import { useEpoch } from "../stores/useEpoch";

interface WrittenContractItemProps {
  contractId: BigNumberish;
  quantity: BigNumberish;
  contractPrice: BigNumberish;
  settlementEpoch: BigNumberish;
  writer: string;
}

export const WrittenContractItem: React.FC<WrittenContractItemProps> = ({
  contractId,
  contractPrice,
  quantity,
  settlementEpoch,
  ...props
}) => {
  const pricePerUnit = calculatePricePerUnit(contractPrice, quantity);
  const epoch = useEpoch((state) => state.currentContractEpoch);

  const DAY = 1000 * 60 * 60 * 24;
  const NOW = Date.now();

  const [expirationDate, setExpirationDate] = useState<number | string>("-");

  useEffect(() => {
    setExpirationDate(
      new Date(NOW - (NOW % DAY)).valueOf() +
        BigNumber.from(settlementEpoch).sub(epoch).toNumber() * DAY
    );
  }, [epoch, DAY, NOW, settlementEpoch]);

  return (
    <Box
      w={"100%"}
      mb={"10px"}
      py={"12px"}
      rounded={"2xl"}
      bg={"white"}
      boxShadow="0px 0px 15px rgba(0,0,0,0.1)"
    >
      <SimpleGrid
        columns={4}
        spacing={0}
        px={"30px"}
        alignSelf={"center"}
        alignItems={"center"}
      >
        <Text>
          {ethers.utils.formatUnits(pricePerUnit, 6)} {tokenSymbols.STABLE}
        </Text>
        <Text>
          {ethers.utils.formatUnits(quantity, 6)} {tokenSymbols.NATIVE}
        </Text>
        <Text>{new Date(expirationDate).toLocaleDateString()}</Text>
        <Button
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          color={"white"}
          bgGradient="linear(to-l, #68D391, #68D3CC)"
          w={"180px"}
          justifySelf={"flex-end"}
          onClick={() => useCoreContract.getState().cancelPosition(contractId)}
        >
          <Box fontSize={"large"} fontWeight={"extrabold"}>
            Cancel
          </Box>
        </Button>
      </SimpleGrid>
    </Box>
  );
};

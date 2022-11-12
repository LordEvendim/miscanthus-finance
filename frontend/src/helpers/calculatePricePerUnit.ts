import { BigNumber, BigNumberish, ethers } from "ethers";

export const calculatePricePerUnit = (
  contractValue: BigNumberish,
  quantity: BigNumberish
): string => {
  contractValue = BigNumber.from(contractValue);
  quantity = BigNumber.from(quantity);

  const ETHER = BigNumber.from(ethers.utils.parseUnits("1", 6));

  return contractValue.mul(ETHER).div(quantity).toString();
};

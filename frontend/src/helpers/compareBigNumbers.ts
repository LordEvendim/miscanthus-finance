import { BigNumber, BigNumberish } from "ethers";

export const filterValueForBigNumbers = (a: BigNumberish, b: BigNumberish) => {
  const bigA = BigNumber.from(a);
  const bigB = BigNumber.from(b);

  return bigA.gt(bigB) ? 1 : -1;
};

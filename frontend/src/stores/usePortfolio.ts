import { BigNumber, ethers } from "ethers";
import create from "zustand";

import { useContracts } from "./useContracts";
import { useEpoch } from "./useEpoch";
import { useUserData } from "./useUserData";

interface usePortfolioStore {
  userHoldings: any[];
  writtenContracts: any[];
  createdContractsValue: string;
  ownedContractsValue: string;
  readyContractsValue: string;
  isFetchingPortfolio: boolean;
  fetchPortfolio: () => Promise<void>;
}

export const usePortfolio = create<usePortfolioStore>((set) => ({
  userHoldings: [],
  writtenContracts: [],
  createdContractsValue: "-",
  ownedContractsValue: "-",
  readyContractsValue: "-",
  isFetchingPortfolio: false,
  fetchPortfolio: async () => {
    set({ isFetchingPortfolio: false });
    try {
      const core = useContracts.getState().core;
      const userAddress = useUserData.getState().address;

      if (!core) throw new Error("Core contract not defined");
      if (!userAddress) throw new Error("Please login to your TronLink");

      // @ts-ignore
      const result = await core.getUserPositions().call();

      console.log("<> result <>");
      console.log(result);

      const owners: Array<Promise<any>> = [];

      result.forEach((position: any) => {
        // @ts-ignore
        console.log(position.contractId);
        // @ts-ignore
        owners.push(core.ownerOf(position.contractId).call());
      });

      const userHoldings = [];
      const writtenContracts = [];
      let holdingsValue = BigNumber.from("0");
      let writtenValue = BigNumber.from("0");
      let readyValue = BigNumber.from("0");

      for (let i = 0; i < owners.length; i++) {
        const owner = window.tronWeb.address.fromHex(await owners[i]);

        if (owner === userAddress) {
          userHoldings.push(result[i]);
          holdingsValue = holdingsValue.add(result[i].contractPrice);

          if (
            BigNumber.from(useEpoch.getState().currentContractEpoch).gte(
              result[i].settlementEpoch
            )
          ) {
            readyValue = readyValue.add(result[i].contractPrice);
          }
        } else {
          writtenContracts.push(result[i]);
          writtenValue = writtenValue.add(result[i].contractPrice);
        }
      }

      set({
        isFetchingPortfolio: false,
        userHoldings,
        writtenContracts,
        createdContractsValue: ethers.utils.formatUnits(writtenValue, 6),
        ownedContractsValue: ethers.utils.formatUnits(holdingsValue, 6),
        readyContractsValue: ethers.utils.formatUnits(readyValue, 6),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error);
      }
    }

    set({ isFetchingPortfolio: false });
  },
}));

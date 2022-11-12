import { BigNumber, BigNumberish } from "ethers";
import { toast } from "react-toastify";
import create from "zustand";
import { useContracts } from "./useContracts";

interface useEpochStore {
  currentEpoch: BigNumberish;
  currentContractEpoch: BigNumberish;
  hasFetchedEpoch: boolean;
  fetchCurrentEpoch: () => Promise<void>;
  increaseEpoch: () => void;
  decreaseEpoch: () => void;
}

export const useEpoch = create<useEpochStore>((set, get) => ({
  currentEpoch: BigNumber.from(0),
  currentContractEpoch: BigNumber.from(0),
  hasFetchedEpoch: false,
  fetchCurrentEpoch: async () => {
    try {
      // fetch current epoch from smart contract
      const contract = useContracts.getState().core;

      if (!contract) {
        throw new Error("Core contract not defined");
      }

      // @ts-ignore
      const result = await contract.getCurrentEpoch().call();

      if (!result) {
        throw new Error("Cannot fetch current epoch from core");
      }

      set({
        currentEpoch: result,
        currentContractEpoch: result,
        hasFetchedEpoch: true,
      });
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
      }

      console.log(error);
    }
  },
  increaseEpoch: () =>
    set({
      currentEpoch: BigNumber.from(get().currentEpoch).add("1"),
    }),
  decreaseEpoch: () => {
    const decreasedEpoch = BigNumber.from(get().currentEpoch).sub("1");

    set({
      currentEpoch: decreasedEpoch.lte(0)
        ? BigNumber.from("0")
        : decreasedEpoch,
    });
  },
}));

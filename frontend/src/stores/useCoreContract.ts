import { BigNumber, BigNumberish } from "ethers";
import { toast } from "react-toastify";
import create from "zustand";
import { useContracts } from "./useContracts";
import { useUserData } from "./useUserData";
import { contractAddresses } from "../constants/contracts";
import { currentNetwork } from "../constants/networks";
import { tokenSymbols } from "../constants/tokenSymbols";

export interface FutureDetails {
  contractId: BigNumberish;
  quantity: BigNumberish;
  contractPrice: BigNumberish;
  settlementEpoch: BigNumberish;
  writer: string;
}

interface useCoreContractStore {
  contracts: FutureDetails[];
  fetchContracts: (epoch: BigNumberish) => Promise<void>;
  fetchUSDBalance: () => Promise<string>;
  fetchBalance: () => Promise<string>;
  writeContract: (
    quantity: BigNumberish,
    contractEpochDuration: BigNumberish,
    contractPrice: BigNumberish
  ) => Promise<void>;
  withdrawUSD: (amount: BigNumberish) => Promise<void>;
  withdraw: (amount: BigNumberish) => Promise<void>;
  depositUSD: (amount: BigNumberish) => Promise<void>;
  deposit: (amount: BigNumberish) => Promise<void>;
  buyContract: (contractId: BigNumberish) => Promise<void>;
  cancelPosition: (contractId: BigNumberish) => Promise<void>;
  settleContract: (contractId: BigNumberish) => Promise<void>;
}

export const useCoreContract = create<useCoreContractStore>((set) => ({
  contracts: [],
  fetchContracts: async (epoch: BigNumberish) => {
    try {
      const core = useContracts.getState().core;

      if (!core) {
        throw new Error("Cannot fetch contracts. Please connect your wallet");
      }

      // @ts-ignore
      const result = await core.getAllContracts(epoch).call();

      console.log(result);

      set({ contracts: result });
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      console.log(error);
    }
  },
  fetchUSDBalance: async () => {
    try {
      const core = useContracts.getState().core;
      const address = useUserData.getState().address;

      if (!core) throw new Error("Core contract not defined");
      if (!address) throw new Error("Login to your wallet");

      // @ts-ignore
      const result = await core.userBalanceUSD(address).call();

      return result.toString();
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
      }

      console.log(error);
      throw error;
    }
  },
  fetchBalance: async () => {
    try {
      const core = useContracts.getState().core;
      const address = useUserData.getState().address;

      if (!core) throw new Error("Core contract not defined");
      if (!address) throw new Error("Login to your wallet");

      // @ts-ignore
      const result = await core.userBalance(address).call();

      console.log(result);

      return result.toString();
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
      }

      console.log(error);
      throw error;
    }
  },
  writeContract: async (
    quantity: BigNumberish,
    contractEpochDuration: BigNumberish,
    contractPrice: BigNumberish
  ) => {
    try {
      const core = useContracts.getState().core;

      if (!core) {
        throw new Error("Core contract not defined");
      }

      const result = await core
        .writeContract(quantity, contractEpochDuration, contractPrice)
        // @ts-ignore
        .send({
          feeLimit: 100_000_000,
          callValue: 0,
          shouldPollResponse: false,
        });

      if (!result) {
        throw new Error("Failed to create a new contract");
      }

      console.log("Contract has been created");
      console.log(result);

      toast.success("Contract has been created");
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      console.log(error);
    }
  },
  withdrawUSD: async (amount: BigNumberish) => {
    try {
      const core = useContracts.getState().core;

      if (!core) {
        throw new Error("Core contract not defined");
      }

      // @ts-ignore
      const result = await core.withdrawUSD(amount).send({
        feeLimit: 100_000_000,
        callValue: 0,
        shouldPollResponse: false,
      });

      if (!result) {
        throw new Error("Cannot withdraw USD");
      }

      console.log("Withdrawn USD");
      console.log(result);

      toast.success("Successfully withdrawn USD");
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      console.log(error);
    }
  },
  withdraw: async (amount: BigNumberish) => {
    try {
      const core = useContracts.getState().core;

      if (!core) {
        throw new Error("Core contract not defined");
      }

      // @ts-ignore
      const result = await core.withdraw(amount).send({
        feeLimit: 100_000_000,
        callValue: 0,
        shouldPollResponse: false,
      });

      if (!result) {
        throw new Error(`Cannot withdraw ${tokenSymbols.NATIVE}`);
      }

      console.log(`Successfully withdrawn ${tokenSymbols.NATIVE}`);
      console.log(result);

      toast.success(`Successfully withdrawn ${tokenSymbols.NATIVE}`);
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      console.log(error);
    }
  },
  depositUSD: async (amount: BigNumberish) => {
    try {
      const core = useContracts.getState().core;
      const stable = useContracts.getState().stablecoin;
      const userAddress = useUserData.getState().address;

      if (!core) {
        throw new Error("Core contract not defined");
      }

      if (!stable) {
        throw new Error("Stablcoin contract is not defined");
      }

      if (!userAddress) {
        throw new Error("User address not defined");
      }

      console.log(userAddress);
      console.log(contractAddresses[currentNetwork].CORE);

      const allowed = await stable
        .allowance(userAddress, contractAddresses[currentNetwork].CORE)
        // @ts-ignore
        .call();

      const allowanceDiff = BigNumber.from(amount).sub(BigNumber.from(allowed));

      if (allowanceDiff.gt("0")) {
        const resultApprove = await stable
          .approve(contractAddresses[currentNetwork].CORE, allowanceDiff)
          // @ts-ignore
          .send({
            feeLimit: 100_000_000,
            callValue: 0,
          });

        console.log("Allowance was required");
        console.log("Increased allowance by: " + allowanceDiff.toString());
      }

      // @ts-ignore
      const resultDeposit = await core.depositUSD().send({
        feeLimit: 100_000_000,
        callValue: 0,
        shouldPollResponse: false,
      });

      console.log("Deposited USD");
      toast.success("Successfully deposited USD");
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      console.log(error);
    }
  },
  deposit: async (amount: BigNumberish) => {
    try {
      const core = useContracts.getState().core;

      if (!core) {
        throw new Error("Core contract not defined");
      }

      console.log("<> deposit <>");
      console.log(amount.toString());

      // @ts-ignore
      const result = await core.deposit().send({
        feeLimit: 100_000_000,
        callValue: amount,
        shouldPollResponse: false,
      });

      if (!result) {
        throw new Error(`Cannot deposit ${tokenSymbols.NATIVE}`);
      }

      console.log(`Successfully deposited ${tokenSymbols.NATIVE}`);
      console.log(result);

      toast.success(`Successfully deposited ${tokenSymbols.NATIVE}`);
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      console.log(error);
    }
  },
  buyContract: async (contractId: BigNumberish) => {
    try {
      const core = useContracts.getState().core;

      if (!core) {
        throw new Error("Core contract not defined");
      }

      // @ts-ignore
      const result = await core.buyContract(contractId).send({
        feeLimit: 100_000_000,
        callValue: 0,
        shouldPollResponse: false,
      });

      if (!result) {
        throw new Error("Cannot buy contract");
      }

      console.log("Successfully bought contract");
      console.log(result);

      toast.success("Successfully bought contract");
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      console.log(error);
    }
  },
  cancelPosition: async (contractId: BigNumberish) => {
    try {
      const core = useContracts.getState().core;

      if (!core) {
        throw new Error("Core contract not defined");
      }

      // @ts-ignore
      const result = await core.cancelPosition(contractId.toString()).send({
        feeLimit: 100_000_000,
        callValue: 0,
        shouldPollResponse: false,
      });

      if (!result) {
        throw new Error("Cannot cancel your position");
      }

      console.log("Successfully canceled your position");
      console.log(result);

      toast.success("Successfully canceled your position");
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      console.log(error);
    }
  },
  settleContract: async (contractId: BigNumberish) => {
    try {
      const core = useContracts.getState().core;

      if (!core) {
        throw new Error("Core contract not defined");
      }

      // @ts-ignore
      const result = await core.settleContract(contractId).send({
        feeLimit: 100_000_000,
        callValue: 0,
        shouldPollResponse: false,
      });

      if (!result) {
        throw new Error("Cannot settle contract");
      }

      console.log("Successfully settled contract");
      console.log(result);

      toast.success("Successfully settled contract");
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      console.log(error);
    }
  },
}));

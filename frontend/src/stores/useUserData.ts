import { toast } from "react-toastify";
import create from "zustand";
import { useCoreContract } from "./useCoreContract";

interface UserDataStore {
  isLogged: boolean;
  address: string;
  balance: string;
  stableBalance: string;
  fetchBalances: () => Promise<void>;
  login: (address: string) => void;
  logout: () => void;
}

export const useUserData = create<UserDataStore>((set) => ({
  isLogged: false,
  address: "",
  balance: "-",
  stableBalance: "-",
  fetchBalances: async () => {
    try {
      const stableBalance = await useCoreContract.getState().fetchUSDBalance();
      const balance = await useCoreContract.getState().fetchBalance();

      set({ stableBalance, balance });
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
      }

      console.log(error);
    }
  },
  login: (address: string) => set({ address, isLogged: true }),
  logout: () => set({ address: "", isLogged: false }),
}));

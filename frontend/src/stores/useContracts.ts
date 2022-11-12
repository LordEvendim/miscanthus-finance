import create from "zustand";
import { MiscanthusCore, Stablecoin } from "../contracts/typechain";

interface ContractStore {
  core: MiscanthusCore | undefined;
  stablecoin: Stablecoin | undefined;
  setCore: (core: MiscanthusCore) => void;
  setStable: (stablecoin: Stablecoin) => void;
}

export const useContracts = create<ContractStore>((set) => ({
  core: undefined,
  stablecoin: undefined,
  setCore: (core: MiscanthusCore) => set(() => ({ core })),
  setStable: (stablecoin: Stablecoin) => set(() => ({ stablecoin })),
}));

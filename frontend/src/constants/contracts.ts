import { useNetwork } from "../stores/useNetwork";
import { AvailableNetworks } from "./networks";

interface DeployedContracts {
  STABLECOIN: string;
  CORE: string;
}

export const contractAddresses: {
  [network in AvailableNetworks]: DeployedContracts;
} = {
  local: {
    STABLECOIN: "",
    CORE: "",
  },
  tron: {
    STABLECOIN: "",
    CORE: "",
  },
  tronTestnet: {
    STABLECOIN: "THbMnXCWHWKG473i8iCbVgqDvMx9Ew2WVU",
    CORE: "TRSBoK2qB2jK9Wgk1WLbiUoFxdyT751gfx",
  },
};

export const getContractAddress = (
  contract: keyof DeployedContracts = "CORE"
): string => contractAddresses[useNetwork.getState().network][contract];

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
    CORE: "TVm22VuHmhxAuxN9f1LfpmrJTWS8aAYG9R",
  },
};

export const getContractAddress = (
  contract: keyof DeployedContracts = "CORE"
): string => contractAddresses[useNetwork.getState().network][contract];

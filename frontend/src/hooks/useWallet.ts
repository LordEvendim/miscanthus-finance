import { useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useCallback, useState } from "react";
import { MiscanthusCore, Stablecoin } from "../contracts/typechain";
import { useContracts } from "../stores/useContracts";

import { useUserData } from "../stores/useUserData";
import CoreContract from "../contracts/artifacts/contracts/MiscanthusCore.sol/MiscanthusCore.json";
import StablecoinContract from "../contracts/artifacts/contracts/Stablecoin.sol/Stablecoin.json";
import { getContractAddress } from "../constants/contracts";
import { isShastaTestnet } from "../helpers/isShastaTestnet";

type useWalletType = [
  isConnecting: boolean,
  connectWallet: () => Promise<void>,
  disconnectWallet: () => void
];

export const useWallet = (): useWalletType => {
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const login = useUserData((state) => state.login);
  const logout = useUserData((state) => state.logout);
  const toast = useToast({ position: "top" });

  const initializeContracts = useCallback(async () => {
    try {
      console.log("Initializing contracts");

      const coreContract = (await window.tronWeb.contract(
        CoreContract.abi,
        getContractAddress()
      )) as MiscanthusCore;
      const stableContract = (await window.tronWeb.contract(
        StablecoinContract.abi,
        getContractAddress("STABLECOIN")
      )) as Stablecoin;

      useContracts.getState().setCore(coreContract);
      useContracts.getState().setStable(stableContract);
    } catch (error: any) {
      console.log(error);

      if (error instanceof Error) {
        toast({
          status: "error",
          title: error.message,
        });
      }
    }
  }, [toast]);

  const checkForCorrectNetwork = useCallback(
    (fullnodeurl: string): boolean => {
      console.log(fullnodeurl);
      const isTestnet = isShastaTestnet(fullnodeurl);
      if (isTestnet) {
        toast({
          title: "Connected to Shasta testnet",
          status: "success",
        });
        return true;
      } else {
        toast({
          title: "Please switch to Shasta testnet",
          status: "error",
        });
        return false;
      }
    },
    [toast]
  );

  const connectWallet = useCallback(async () => {
    try {
      setIsConnecting(true);

      if (!window.tronWeb) throw new Error("Make sure TronLink is installed");

      const provider = new ethers.providers.Web3Provider(window.tronWeb, "any");
      await provider.send("tron_requestAccounts", []);

      const address = window.tronWeb.defaultAddress.base58;

      if (!address) {
        throw new Error("Unlock your TronLink wallet");
      }

      const isCorrectNetwork = checkForCorrectNetwork(
        window.tronWeb.fullNode.host
      );

      // User is using the wrong network
      if (!isCorrectNetwork) {
        logout();
        setIsConnecting(false);
        return;
      }

      await initializeContracts();

      login(address);
      setIsConnecting(false);
    } catch (error: any) {
      toast({
        status: "info",
        title: error.message,
      });
      setIsConnecting(false);
    }
  }, [login, logout, toast, initializeContracts, checkForCorrectNetwork]);

  const disconnectWallet = () => {
    logout();
  };

  return [isConnecting, connectWallet, disconnectWallet];
};

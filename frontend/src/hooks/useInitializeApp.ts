import { useCallback, useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";

import { AsyncActionState } from "../types/states/asyncActionState";
import { useWallet } from "./useWallet";

export const useInitializeApp = () => {
  const [initializationStatus, setInitializationStatus] =
    useState<AsyncActionState>({ status: undefined });
  const toast = useToast();
  const [, connectWallet] = useWallet();

  // Setup wallet events
  const setupWalletEvents = useCallback(() => {
    window.addEventListener("message", (e) => {
      try {
        if (e.data.message.action === "connect") {
          console.log("event [connect]");

          connectWallet();
        }

        if (e.data.message.action === "setNode") {
          console.log("event [setNode]");

          connectWallet();
        }
      } catch (e) {}
    });
  }, [connectWallet]);

  const waitForWalletInjection = useCallback(async (): Promise<boolean> => {
    return await new Promise((resolve) => {
      // Wait for wallet injection
      if (window.tronWeb) return resolve(true);

      // Wallet not detected after 3 seconds
      const timer = setTimeout(() => {
        toast({
          title: "TronLink not detected",
          status: "error",
        });
        resolve(false);
      }, 3000);

      // Wallet detected after waiting
      window.addEventListener(
        "tronLink#initialized",
        (e) => {
          clearTimeout(timer);
          console.log("Initialized");
          console.log(e);

          toast({
            title: "TronLink detected",
            status: "success",
          });
          resolve(true);
        },
        {
          once: true,
        }
      );
    });
  }, [toast]);

  // Main initalization function
  const initializeApplication = useCallback(async () => {
    try {
      setInitializationStatus({ status: "loading" });

      console.log("Waiting for wallet injection");
      // Wait for wallet injection
      const isInjected = await waitForWalletInjection();

      console.log("Wallet injection staus: " + isInjected);
      if (!isInjected) throw new Error("TronLink wallet not detected");

      setupWalletEvents();

      connectWallet();

      setInitializationStatus({ status: "succeeded" });
    } catch (error: any) {
      if (error instanceof Error) {
        return setInitializationStatus({ status: "failed", error });
      }

      setInitializationStatus({
        status: "failed",
        error: new Error("Failed to initialize application"),
      });
    }
  }, [connectWallet, setupWalletEvents, waitForWalletInjection]);

  // Run initialization only once
  useEffect(() => {
    if (initializationStatus.status !== undefined) return;

    initializeApplication();
  }, [initializationStatus, initializeApplication]);

  return initializationStatus;
};

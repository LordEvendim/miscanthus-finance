import create from "zustand";

interface useGenericBalanceModalStore {
  isNative: boolean;
  isWithdrawing: boolean;
  isOpen: boolean;
  onClose: () => void;
  openModal: (isNative: boolean, isWithdrawing: boolean) => void;
}

export const useGenericBalanceModal = create<useGenericBalanceModalStore>(
  (set) => ({
    isNative: false,
    isWithdrawing: false,
    isOpen: false,
    onClose: () => {
      set({ isOpen: false });
    },
    openModal: (isNative: boolean, isWithdrawing: boolean) => {
      set({ isNative, isWithdrawing, isOpen: true });
    },
  })
);

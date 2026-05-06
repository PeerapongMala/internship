import { create } from 'zustand';
import type { ETaxWizardStep, QRScanResult, CustomerVerification } from '../types/etax';

interface ETaxState {
  wizardStep: ETaxWizardStep;
  wizardOpen: boolean;
  currentScanResult: QRScanResult | null;
  currentVerification: CustomerVerification | null;
  setWizardStep: (step: ETaxWizardStep) => void;
  setWizardOpen: (open: boolean) => void;
  setScanResult: (result: QRScanResult | null) => void;
  setVerification: (result: CustomerVerification | null) => void;
  resetWizard: () => void;
}

export const useETaxStore = create<ETaxState>()((set) => ({
  wizardStep: 'scan',
  wizardOpen: false,
  currentScanResult: null,
  currentVerification: null,
  setWizardStep: (step) => set({ wizardStep: step }),
  setWizardOpen: (open) => set({ wizardOpen: open }),
  setScanResult: (result) => set({ currentScanResult: result }),
  setVerification: (result) => set({ currentVerification: result }),
  resetWizard: () =>
    set({
      wizardStep: 'scan',
      wizardOpen: false,
      currentScanResult: null,
      currentVerification: null,
    }),
}));

import { create } from 'zustand';

interface DrawState {
  latestResult: {
    numbers: number[];
    prizePool: number;
    month: string;
  } | null;
  isSimulating: boolean;
  setLatestResult: (result: any) => void;
  setSimulating: (simulating: boolean) => void;
}

export const useDrawStore = create<DrawState>((set) => ({
  latestResult: null,
  isSimulating: false,
  setLatestResult: (result) => set({ latestResult: result }),
  setSimulating: (isSimulating) => set({ isSimulating }),
}));

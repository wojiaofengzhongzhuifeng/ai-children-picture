import { create } from "zustand";

export interface ShowPageStore {
  aiCreactPicture: (string | null)[];
  setAiCreactPicture: (aiCreactPicture: (string | null)[]) => void;
}

export const useShowPageStore = create<ShowPageStore>()((set) => ({
  aiCreactPicture: [],
  setAiCreactPicture: (aiCreactPicture: (string | null)[]) => set({ aiCreactPicture }),
}));

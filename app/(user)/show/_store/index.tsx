import { create } from "zustand";
import { PostAiCreactPicture } from "../_api/postAiCreactPicture";

export interface ShowPageStore {
  aiCreactPicture: PostAiCreactPicture[];
  setAiCreactPicture: (aiCreactPicture: PostAiCreactPicture[]) => void;
}

export const useShowPageStore = create<ShowPageStore>()((set) => ({
  aiCreactPicture: [],
  setAiCreactPicture: (aiCreactPicture: PostAiCreactPicture[]) => set({ aiCreactPicture }),
}));

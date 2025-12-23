import { create } from "zustand";
import { PostFormList } from "../postFormLIst";

export interface FormStore {
  formList: PostFormList[];
  setFormList: (formList: PostFormList[]) => void;
}

export const useFormStore = create<FormStore>()((set) => ({
  formList: [],
  setFormList: (formList: PostFormList[]) => set({ formList }),
}));

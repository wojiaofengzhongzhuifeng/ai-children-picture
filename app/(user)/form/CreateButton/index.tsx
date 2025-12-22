"use client";

import { CreateButtonIcon } from "./icon";
import { CreateButtonProps } from "../pageApi";

export default function CreateButton({ onSubmit }: CreateButtonProps) {
  const handleCreate = () => {
    const formData = onSubmit();
    console.log("生成我的绘本 - 表单数据:");
    console.log(JSON.stringify(formData, null, 2));
  };

  return (
    <div className="flex justify-center mt-10">
      <button 
        onClick={handleCreate}
        className="bg-orange-500 text-white px-14 py-4 rounded-md w-[825px] flex items-center justify-center gap-2"
      >
        <CreateButtonIcon />
        生成我的绘本
        <CreateButtonIcon />
      </button>
    </div>
  );
}

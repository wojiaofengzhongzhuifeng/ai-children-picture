import { CreateButtonIcon } from "./icon";

export default function CreateButton() {
  return (
    <div className="flex justify-center mt-10">
      <button className="bg-orange-500 text-white px-14 py-4 rounded-md w-[825px] flex items-center justify-center gap-2">
        <CreateButtonIcon />
        生成我的绘本
        <CreateButtonIcon />
      </button>
    </div>
  );
}

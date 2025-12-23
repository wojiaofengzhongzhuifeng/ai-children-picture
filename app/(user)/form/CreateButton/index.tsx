"use client";

import { CreateButtonIcon } from "./icon";
import { CreateButtonProps } from "../pageApi";
import { usePostFormListHooks } from "../_hooks/postFormListHooks";
import { PostFormList } from "../_api/postFormLIst";
import { toast } from "@/hooks/use-toast";

export default function CreateButton({ onSubmit }: CreateButtonProps) {
  const { run, loading } = usePostFormListHooks();

  const handleCreate = async () => {
    const formData = onSubmit();
    console.log("生成我的绘本 - 表单数据:");
    console.log(JSON.stringify(formData, null, 2));

    // 验证必填字段
    if (
      !formData.child_age ||
      !formData.illustration_style ||
      formData.themes.length === 0 ||
      !formData.story_overview ||
      !formData.central_idea
    ) {
      toast({
        title: "请填写完整信息",
        description: "请确保所有必填项都已填写",
        variant: "destructive",
      });
      return;
    }

    // 转换为 API 需要的格式
    const apiData: PostFormList = {
      child_age: formData.child_age,
      illustration_style: formData.illustration_style,
      themes: formData.themes,
      story_overview: formData.story_overview,
      central_idea: formData.central_idea,
    };

    run(apiData);
  };

  return (
    <div className="flex justify-center mt-10">
      <button
        onClick={handleCreate}
        disabled={loading}
        className="bg-orange-500 text-white px-14 py-4 rounded-md w-[825px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <CreateButtonIcon />
        {loading ? "生成中..." : "生成我的绘本"}
        <CreateButtonIcon />
      </button>
    </div>
  );
}

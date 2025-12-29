"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { usePostFormListHooks } from "../form/_hooks/postFormListHooks";
import { useShowPageStore, useStoryDataStore } from "./_store";
import { postAiCreactPicture } from "./_api/postAiCreactPicture";
import { CopyIcon, DeleteIcon, EditIcon, SaveIcon } from "lucide-react";
import { AddIcon, RefreshIcon } from "./icon";

// 场景类型定义
interface Scene {
  text: string;
  img_text_prompt: string;
  imageUrl?: string | null;
}

export default function ShowPage() {
  const searchParams = useSearchParams();
  const payload = searchParams.get("payload");
  const [bookData, setBookData] = useState<any>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const hasRunRef = useRef(false);
  const hasStartedImageGeneration = useRef(false);
  const { data, loading, run, success } = usePostFormListHooks();
  const { aiCreactPicture, setAiCreactPicture } = useShowPageStore();
  const { storyData, setStoryData, updateSceneImage } = useStoryDataStore();

  useEffect(() => {
    if (!payload) return;

    try {
      const parsed = JSON.parse(decodeURIComponent(payload));
      setBookData(parsed);
    } catch (e) {
      console.error("解析 payload 失败:", e);
    }
  }, [payload]); // 只依赖 payload 字符串，不依赖整个 searchParams 对象

  useEffect(() => {
    if (!bookData || hasRunRef.current) return;

    hasRunRef.current = true; // 标记已执行过

    run({
      child_age: bookData.child_age,
      illustration_style: bookData.illustration_style,
      themes: bookData.themes,
      story_overview: bookData.story_overview,
      central_idea: bookData.central_idea,
    });
  }, [bookData, run]); // 添加依赖数组，防止无限执行

  useEffect(() => {
    if (data && success && data.scenes && !isGeneratingImages) {
      setAiCreactPicture(
        data.scenes.map((scene: any) => scene.img_text_prompt)
      );
    }
  }, [data, success, setAiCreactPicture, isGeneratingImages]);

  useEffect(() => {
    if (aiCreactPicture.length > 0 && !hasStartedImageGeneration.current) {
      hasStartedImageGeneration.current = true;
      setIsGeneratingImages(true);

      // 使用 forEach 带 index，并直接调用 API
      const promises = aiCreactPicture.map(
        async (prompt: string | null, index: number) => {
          if (prompt) {
            try {
              const response = await postAiCreactPicture({
                prompt: prompt,
                model: "dall-e-3",
                size: "512x512",
              });

              // 获取图片 URL 并保存到 Store
              if (response.success && response.data) {
                const imageUrl = response.data.url || response.data;
                updateSceneImage(index, imageUrl);
                console.log(`场景 ${index} 图片保存成功:`, imageUrl);
              }
            } catch (error) {
              console.error(`场景 ${index} 图片生成失败:`, error);
            }
          }
        }
      );
      Promise.all(promises).then(() => {
        setIsGeneratingImages(false);
      });
    }
  }, [aiCreactPicture, updateSceneImage]);

  useEffect(() => {
    if (bookData && data && data.scenes) {
      setStoryData({
        id: Date.now(), // 或者使用其他唯一 ID
        data: {
          child_age: bookData.child_age,
          illustration_style_label: bookData.illustration_style,
          story_overview: bookData.story_overview,
          central_idea: bookData.central_idea,
          themes: bookData.themes,
          usage: data.usage || {
            completion_tokens: 0,
            prompt_tokens: 0,
            total_tokens: 0,
          },
          scenes: data.scenes, // AI 返回的场景数据
        },
      });
    }
  }, [bookData, data]);

  if (!bookData) {
    return <div>加载中...</div>;
  }

  if (isGeneratingImages) {
    return <div>正在生成图片，请稍候...</div>;
  }

  // 当前选中的场景
  const scenes = storyData?.data.scenes || [];
  const currentScene = scenes[pageIndex] as Scene | undefined;
  const totalPages = scenes.length;

  return (
    <div className="flex gap-2 h-screen">
      {/* 左侧页面列表 */}
      <div className="h-screen overflow-y-auto w-1/6">
        <div className="bg-white border-blue-200 border-solid border-4 rounded-md p-4">
          <h2 className="text-orange-500 text-2xl mb-2">页面列表</h2>
          <div className="text-orange-400 text-sm mb-4">共{totalPages}页</div>
          <hr className="border-gray-300 my-2" />

          {/* 页面缩略图列表 */}
          <div className="space-y-4">
            {scenes.map((scene: Scene, index: number) => (
              <div
                key={index}
                className={`bg-yellow-50 p-2 rounded-lg border-solid border-4 cursor-pointer relative overflow-hidden transition-all ${
                  pageIndex === index
                    ? "border-pink-500 ring-2 ring-pink-300"
                    : "border-orange-300 hover:border-orange-400"
                }`}
                onClick={() => setPageIndex(index)}
              >
                <img
                  src={scene.imageUrl || ""}
                  alt={`第${index + 1}页`}
                  className="w-full h-32 object-cover rounded-md"
                />
                <div className="absolute bottom-12 right-2 w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm shadow-md">
                  {index + 1}
                </div>
                <div className="text-gray-700 text-sm mt-2 px-1 line-clamp-2">
                  {scene.text}
                </div>
              </div>
            ))}
          </div>

          {/* 底部操作按钮 */}
          <div className="sticky bottom-0 bg-white pt-4 mt-4 space-y-2">
            <button className="flex items-center justify-center gap-1 bg-green-500 text-white px-4 py-2 rounded-full w-full hover:bg-green-600 transition-colors">
              <AddIcon />
              添加新页
            </button>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-full hover:bg-blue-600 transition-colors">
                <CopyIcon className="w-4 h-4" />
                复制
              </button>
              <button className="flex-1 flex items-center justify-center gap-1 bg-red-500 text-white px-3 py-2 rounded-full hover:bg-red-600 transition-colors">
                <DeleteIcon className="w-4 h-4" />
                删除
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 中间预览区域 */}
      <div className="w-5/7 bg-white border-blue-200 border-solid border-4 rounded-md p-4 h-screen overflow-y-auto">
        {/* 头部 */}
        <div className="flex justify-between border-b-2 border-pink-300 pb-2 pt-2 items-center">
          <div className="font-medium">👁 预览区域</div>
          <div className="flex gap-2 items-center">
            <div className="text-pink-500 text-sm">
              第{pageIndex + 1}/{totalPages}页
            </div>
            <button className="bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition-colors flex items-center gap-1 text-sm">
              <SaveIcon className="w-4 h-4" />
              保存
            </button>
          </div>
        </div>

        {/* 预览内容 */}
        <div className="flex justify-center mt-4">
          <div className="w-3/5 flex flex-col gap-4">
            {/* 图片区域 */}
            <div className="border-4 border-orange-300 rounded-md p-4 bg-gray-200 shadow-lg">
              <img
                src={currentScene?.imageUrl || ""}
                alt={`第${pageIndex + 1}页预览`}
                className="w-full h-auto object-cover rounded-md"
              />
            </div>
            {/* 文字区域 */}
            <div className="border-4 border-yellow-300 rounded-md p-4 text-orange-500 flex items-center gap-2">
              <EditIcon className="w-4 h-4 shrink-0" />
              <span>{currentScene?.text || "暂无文字"}</span>
            </div>
          </div>
        </div>
      </div>
      {/* 右侧编辑内容 */}
      <div className="h-screen w-1/6">
        <div className="bg-white border-green-200 border-solid border-4 rounded-md p-4 h-full flex flex-col">
          <h2 className="text-orange-500 text-2xl mb-2">🖊编辑属性</h2>
          <div className="text-orange-400 text-sm mb-4">正在编辑图片</div>
          <hr className="border-gray-300 my-2" />
          <div className="flex-1 flex flex-col">
            <div className="text-orange-500 text-sm mb-2">图片提示词</div>
            <textarea
              key={pageIndex}
              className="w-full border-4 border-yellow-300 rounded-md p-2 flex-1 resize-none min-h-[200px]"
              value={currentScene?.img_text_prompt || ""}
              readOnly
            />
          </div>
          <button
            className="bg-blue-500 text-white px-2 py-2 mt-4 rounded-md justify-center
           hover:bg-blue-600 transition-colors flex items-center gap-1 text-sm w-full text-center"
          >
            <RefreshIcon /> 重新生成图片
          </button>
          <div className="border-2 border-blue-300 rounded-md p-2 mt-4 text-blue-500 bg-blue-50">
            <div>💡提示</div>
            <div>
              点击中间预览区的图片可以选择并编辑它。修改提示词后点击重新生成。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

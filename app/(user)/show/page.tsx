"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { usePostFormListHooks } from "../form/_hooks/postFormListHooks";

export default function ShowPage() {
  const [bookData, setBookData] = useState<any>(null);
  const searchParams = useSearchParams();
  const { data, error, loading, run } = usePostFormListHooks();
  const hasRunRef = useRef(false);

  // 获取 payload 参数
  const payload = searchParams.get("payload");

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

  if (!bookData) {
    return <div>加载中...</div>;
  }

  console.log("bookData", bookData);
  console.log("data", data);

  return (
    <div>
      {/* 左侧页面列表 */}
      <div className="w-1/7 bg-white  border-blue-200 border-solid border-4 rounded-md p-4">
        <h2 className="text-orange-500 text-2xl  mb-2">页面列表</h2>
        <div className="text-orange-400 text-sm mb-4">共10页</div>
        <hr className="border-gray-300 my-2" />
        <div>
          <div className="bg-yellow-100 p-2 rounded-md border-orange-200 border-solid border-4 hover:border-orange-300 cursor-pointer h-40 relative">
            <div className="absolute bottom-2 right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white  text-sm shadow-md">
              1
            </div>
          </div>
        </div>
      </div>
      {/* 中间绘画图片 */}

      {/* 右侧编辑内容 */}
    </div>
  );
}

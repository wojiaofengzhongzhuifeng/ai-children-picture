"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ShowPage() {
  const [bookData, setBookData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // 从 sessionStorage 获取数据
    if (typeof window !== "undefined") {
      const storedData = sessionStorage.getItem("bookData");
      if (storedData) {
        try {
          setBookData(JSON.parse(storedData));
        } catch (error) {
          console.error("解析数据失败:", error);
        }
      } else {
        // 如果没有数据，可以跳转回表单页面
        // router.push("/form");
      } 
    }
  }, []);

  if (!bookData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">生成的绘本内容</h1>
      
      {bookData.scenes && bookData.scenes.length > 0 && (
        <div className="space-y-6">
          {bookData.scenes.map((scene: any, index: number) => (
            <div key={index} className="border rounded-lg p-6 bg-white shadow-sm">
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">场景 {index + 1}</h2>
                <p className="text-gray-700">{scene.text}</p>
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">
                  <strong>图片提示词:</strong> {scene.img_text_prompt}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {bookData.metadata && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">生成信息</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>年龄段:</strong> {bookData.metadata.child_age_label}
            </div>
            <div>
              <strong>插画风格:</strong> {bookData.metadata.illustration_style_label}
            </div>
            <div>
              <strong>主题:</strong> {bookData.metadata.themes_label}
            </div>
            <div>
              <strong>生成时间:</strong> {bookData.generationTime}ms
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
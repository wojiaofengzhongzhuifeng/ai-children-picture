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

"use client";

import { useEffect, useState } from "react";
import { BookOpenIcon, TrashIcon, EyeIcon } from "lucide-react";
import { useMyLibraryStore } from "./_store/index";
import { SavedBook } from "./_store/index";
export default function MyLibraryPage() {
  const { books, setBooks } = useMyLibraryStore();

  useEffect(() => {
    // 从 localStorage 加载保存的绘本
    const savedBooks = localStorage.getItem("myLibrary");
    if (savedBooks) {
      setBooks(JSON.parse(savedBooks));
    }
  }, []);

  const handleDelete = (id: number) => {
    const updatedBooks = books.filter((book: SavedBook) => book.id !== id);
    setBooks(updatedBooks);
    localStorage.setItem("myLibrary", JSON.stringify(updatedBooks));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-orange-600 mb-4 flex items-center justify-center gap-3">
            <BookOpenIcon className="w-10 h-10" />
            我的绘本库
          </h1>
          <p className="text-orange-400 text-lg">保存的所有绘本作品</p>
        </div>

        {/* 绘本列表 */}
        {books.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-gray-500 text-xl">还没有保存的绘本</p>
            <p className="text-gray-400 mt-2">创建并保存你的第一本绘本吧！</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book: SavedBook) => (
              <div
                key={book.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border-4 border-orange-200 hover:border-orange-400 transition-all hover:shadow-xl"
              >
                {/* 封面图片 */}
                <div className="h-48 bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center">
                  {book.data.scenes[0]?.imageUrl ? (
                    <img
                      src={book.data.scenes[0].imageUrl}
                      alt="封面"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-6xl">📖</div>
                  )}
                </div>

                {/* 绘本信息 */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-orange-600 mb-2 line-clamp-1">
                    {book.data.story_overview || "未命名绘本"}
                  </h3>
                  <div className="text-sm text-gray-500 mb-2">
                    <span className="inline-block bg-orange-100 text-orange-600 px-2 py-1 rounded-full mr-2">
                      {book.data.child_age}
                    </span>
                    <span className="inline-block bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
                      {book.data.scenes.length} 页
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs">
                    创建于 {new Date(book.createdAt).toLocaleDateString()}
                  </p>

                  {/* 操作按钮 */}
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 flex items-center justify-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-full hover:bg-blue-600 transition-colors text-sm">
                      <EyeIcon className="w-4 h-4" />
                      查看
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="flex items-center justify-center gap-1 bg-red-500 text-white px-3 py-2 rounded-full hover:bg-red-600 transition-colors text-sm"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

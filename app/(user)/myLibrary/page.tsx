'use client';

import { useEffect } from 'react';
import { useMyLibraryStore } from './_store';
import { Button } from '@/components/ui/button';
import {
  MyLibraryCollect,
  MyLibraryCreate,
  MyLibraryDelete,
  MyLibraryDownload,
  MyLibraryEdit,
  MyLibraryFavorite,
  MyLibraryPageTotal,
  MyLibraryPictureTotal,
  MyLibraryRead,
  MyLibraryScreen,
  MyLibrarySearch,
} from './icon';

export default function MyLibraryPage() {
  const { books, setBooks } = useMyLibraryStore();
  console.log(`books`, books);
  useEffect(() => {
    const books = localStorage.getItem('myLibrary');
    if (books) setBooks(JSON.parse(books));
  }, []);

  //遍历data生成绘本卡片
  const bookCards = books.map((book: any, index: number) => {
    return (
      <div
        key={book.id || index}
        className="border-2 border-orange-300 rounded-lg p-4 bg-white hover:shadow-xl hover:border-orange-400 transition-all shadow-lg"
      >
        <div className="flex flex-col gap-2 border-b-2 border-orange-100 mb-4 pb-4">
          <div className="w-full h-40 bg-orange-50 rounded-md flex items-center justify-center relative">
            <img
              src={
                book.data.scenes[0]?.imageUrl || '/images/myLibrary/book.png'
              }
              alt="绘本封面"
              className="max-w-full max-h-full object-contain"
            />
            <div className="absolute  right-2">
              <MyLibraryCollect />
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-2">
            <div className="text-md font-bold text-orange-600 line-clamp-1">
              {book.data.central_idea}
            </div>
            <div className="text-sm text-orange-500">
              年龄段：{book.data.child_age}
            </div>
            <div className="text-sm text-orange-500">
              风格：{book.data.illustration_style_label}
            </div>
            <div className="text-sm text-orange-500 line-clamp-1">
              主题：{book.data.themes}
            </div>
          </div>
        </div>
        {/* 按钮区 */}
        <div className="flex gap-2 justify-between">
          <Button className="flex-1 bg-orange-500 shadow-lg hover:bg-orange-600">
            <MyLibraryRead />
            阅读
          </Button>
          <Button className="flex-1 bg-blue-500 shadow-lg hover:bg-blue-600">
            <MyLibraryEdit />
            编辑
          </Button>
          <Button className="bg-red-500 shadow-lg hover:bg-red-600 px-3">
            <MyLibraryDelete />
          </Button>
        </div>
      </div>
    );
  });

  return (
    <div className="w-3/5 mx-auto mt-10">
      {/* 顶部搜索栏 */}
      <div className="border-4 border-orange-300 rounded-md p-4 shadow-lg mb-8">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-md font-bold text-orange-500 mb-2">
              📚我的绘本图书馆
            </div>
            <div className="text-sm text-orange-500">
              共有{books.length}本绘本
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2">
                <MyLibrarySearch />
              </span>
              <input
                type="text"
                placeholder="搜索绘本..."
                className="border-2 border-yellow-200 rounded-md p-2 pl-8 shadow-lg"
              />
            </div>
            <Button className="bg-yellow-100 text-orange-500 shadow-lg">
              <MyLibraryScreen />
              筛选
            </Button>
            <Button className="bg-orange-500 shadow-lg">
              <MyLibraryCreate />
              创建新绘本
            </Button>
          </div>
        </div>
      </div>

      {/* 绘本卡片列表 */}
      <div className="grid grid-cols-3 gap-4">{bookCards}</div>

      {/* 状态栏 */}
      <div className="border-4 border-green-300 rounded-md p-4 shadow-lg mt-8 flex justify-around bg-white mb-10">
        <div className="flex flex-col items-center gap-2">
          <MyLibraryPictureTotal />
          <div className="text-lg text-orange-500">{1}</div>
          <div className="text-sm text-orange-500">创作总数</div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <MyLibraryPageTotal />
          <div className="text-lg text-blue-500">{1}</div>
          <div className="text-sm text-blue-500">总页数</div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <MyLibraryFavorite />
          <div className="text-lg text-green-500">{1}</div>
          <div className="text-sm text-green-500">收藏数</div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <MyLibraryDownload />
          <div className="text-lg text-purple-500">{1}</div>
          <div className="text-sm text-purple-500">导出次数</div>
        </div>
      </div>
    </div>
  );
}

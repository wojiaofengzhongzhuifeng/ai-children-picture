import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingInUserGroupPage() {
  return (
    <div className="py-20">
      <div className="mx-auto w-full max-w-[1152px] px-4 sm:px-6 lg:px-8">
        <p className="text-[72px] font-bold text-primary">
          创作属于你的神奇绘本故事
        </p>
        <p className="text-[24px]">🎨 让每个孩子都能拥有专属的故事世界</p>
        <p className="text-[24px]">🎨 AI 驱动的智能创作，几分钟生成高质量儿童绘本</p>
      </div>
    </div>
  );
}

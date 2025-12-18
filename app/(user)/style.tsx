// 复用的样式类 & 组件，方便在多个组件/页面中共用

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

// 两侧留白 550px 的样式（可组件可 className 复用）
export const sidePadding550Class = "px-[550px]";

export function SidePadding550(props: { children: ReactNode }) {
  return <div className={sidePadding550Class}>{props.children}</div>;
}

// 组件形式：页面骨架 / 标题 / 副标题
// 注意：页面整体的 padding 统一在这里改
export function PageWrapper(props: { children: ReactNode }) {
  return <div className="py-20">{props.children}</div>;
}

export function Section(props: { children: ReactNode; className?: string }) {
  const { children, className = "" } = props;
  const baseClass =
    "mx-auto w-full max-w-[1152px] px-4 sm:px-6 lg:px-8 text-center";
  const combined = `${baseClass}${className ? ` ${className}` : ""}`;
  return <div className={combined}>{children}</div>;
}

export function HeroSection(props: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1152px] px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
      {props.children}
    </div>
  );
}

// 组件形式的标题/副标题，便于 <HeroTitle>xxx</HeroTitle> 这种写法
export function HeroTitle(props: { children: ReactNode }) {
  return <p className="text-[72px] text-orange-600">{props.children}</p>;
}

export function HeroSubtitle(props: { children: ReactNode }) {
  return <p className="text-[24px] text-gray-600">{props.children}</p>;
}

// CTA 按钮组件，便于 <CtaPrimaryButton>xxx</CtaPrimaryButton> 这种写法
export function CtaPrimaryButton(props: { children: ReactNode }) {
  return (
    <Button className="bg-orange-500 rounded-sm px-14 py-8 border-2 border-orange-200 hover:bg-orange-500/80">
      {props.children}
    </Button>
  );
}

export function CtaSecondaryButton(props: { children: ReactNode }) {
  return (
    <Button className="bg-white rounded-sm px-14 py-8 border-2 border-orange-200 hover:bg-orange-200/10">
      {props.children}
    </Button>
  );
}

// 特性标签组件，便于 <FeatureChipOrange>xxx</FeatureChipOrange> 这种写法
export function FeatureChipOrange(props: { children: ReactNode }) {
  return (
    <div className="rounded-full py-4 px-8 shadow-md border-2 border-orange-200 text-orange-600">
      {props.children}
    </div>
  );
}

export function FeatureChipPink(props: { children: ReactNode }) {
  return (
    <div className="rounded-full py-4 px-8 shadow-md border-2 border-pink-200 text-pink-600">
      {props.children}
    </div>
  );
}

export function FeatureChipPurple(props: { children: ReactNode }) {
  return (
    <div className="rounded-full py-4 px-8 shadow-md border-2 border-purple-200 text-purple-600">
      {props.children}
    </div>
  );
}

// 核心功能卡片通用容器，统一宽高与布局
export function FeatureCard(props: {
  children: ReactNode;
  bgClass: string;
  borderClass: string;
}) {
  const { children, bgClass, borderClass } = props;
  return (
    <div className="flex justify-center w-full">
      <div className={`flex flex-col h-full ${bgClass}`}>
        <div
          className={`rounded-xl p-6 w-full max-w-[360px] h-[300px] flex flex-col border-4 ${borderClass}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function UserFeedbackCard(props: {
  children: ReactNode;
  bgClass: string;
  borderClass: string;
}) {
  const { children, bgClass, borderClass } = props;
  return (
    <div className="flex justify-center w-full">
      <div className="flex flex-col h-full">
        <div
          className={`rounded-xl p-8 px-6 w-full max-w-[360px] h-[250px] flex flex-col border-4 ${bgClass} ${borderClass}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function CreatePictureCard(props: {
  children: ReactNode;
  bgClass: string;
  borderClass: string;
}) {
  const { children, bgClass, borderClass } = props;
  return (
    <div className="flex justify-center w-full">
      <div className="flex flex-col h-full">
        <div
          className={`rounded-xl p-8 px-6 w-full max-w-[360px] h-[350px] flex flex-col border-4 ${bgClass} ${borderClass}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function ChoiceUsCard(props: {
  children: ReactNode;
  bgClass: string;
  borderClass: string;
}) {
  const { children, bgClass, borderClass } = props;
  return (
    <div className="flex justify-center w-full">
      <div className="flex flex-col h-full">
        <div
          className={`rounded-xl p-8 px-6  w-[270px] h-[190px] flex flex-col border-4 ${bgClass} ${borderClass}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function CreatePictureWrapper(props: { children: ReactNode }) {
  return <div className="py-20 bg-orange-600">{props.children}</div>;
}

export function CreatePictureTitle(props: { children: ReactNode }) {
  return <p className="text-[48px] text-white">{props.children}</p>;
}

export function CreatePictureSubtitle(props: { children: ReactNode }) {
  return <p className="text-[18px] text-white mt-4">{props.children}</p>;
}

export function CreatePictureButton(props: { children: ReactNode }) {
  return (
    <Button className="bg-white rounded-sm px-14 py-8 border-2 border-white hover:bg-white/80">
      {props.children}
    </Button>
  );
}

export function PageFooterWrapper(props: { children: ReactNode }) {
  return <div className="py-20 bg-gray-900">{props.children}</div>;
}

export function PageFooterTitle(props: { children: ReactNode }) {
  return (
    <p className="text-[32px] text-white flex justify-center gap-2">
      {props.children}
    </p>
  );
}

export function PageFooterItem(props: { children: ReactNode }) {
  return (
    <p className="text-[20px]  text-gray-400 mt-4">
      {props.children}
    </p>
  );
}

export function PageFooterSubtitle(props: { children: ReactNode }) {
  return <p className="text-[16px]  text-gray-400 mt-4">{props.children}</p>;
}

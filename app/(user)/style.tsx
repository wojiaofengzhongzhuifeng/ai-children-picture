// 复用的样式类 & 组件，方便在多个组件/页面中共用

import type { ReactNode } from "react";

// 两侧留白 550px 的样式（可组件可 className 复用）
export const sidePadding550Class = "px-[550px]";

export function SidePadding550(props: { children: ReactNode }) {
  return <div className={sidePadding550Class}>{props.children}</div>;
}

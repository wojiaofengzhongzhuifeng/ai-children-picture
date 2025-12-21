"use client";

import { useState } from "react";
import {
  SectionTitle,
  OptionGroup,
  OptionCard,
  OptionTitle,
} from "../commonStyle";
import {
  PictureBookThemeAdventureExplorationIcon,
  PictureBookThemeCognitiveLearningIcon,
  PictureBookThemeEmotionalEducationIcon,
  PictureBookThemeFantasyAdventureIcon,
  PictureBookThemeNaturalScienceIcon,
  PictureBookThemeSocialBehaviorIcon,
} from "./icon";

// 年龄选项数据
const pictureBookThemeOptions = [
  {
    id: "情感教育",
    title: "情感教育",
    icon: <PictureBookThemeEmotionalEducationIcon />,
    desc: "友谊、同情心",
  },
  {
    id: "认知学习",
    title: "认知学习",
    icon: <PictureBookThemeCognitiveLearningIcon />,
    desc: "数字、颜色、动物",
  },
  {
    id: "社会行为",
    title: "社会行为",
    icon: <PictureBookThemeSocialBehaviorIcon />,
    desc: "分享、礼貌、规则",
  },
  {
    id: "自然科学",
    title: "自然科学",
    icon: <PictureBookThemeNaturalScienceIcon />,
    desc: "天气、太空、植物",
  },
  {
    id: "奇幻冒险",
    title: "奇幻冒险",
    icon: <PictureBookThemeFantasyAdventureIcon />,
    desc: "想象力、探索",
  },
  {
    id: "冒险探索",
    title: "冒险探索",
    icon: <PictureBookThemeAdventureExplorationIcon />,
    desc: "数字、颜色、动物",
  },
];

export default function PictureBookTheme() {
  const [selectedPictureBookTheme, setSelectedPictureBookTheme] = useState<
    string | null
  >(null);

  return (
    <>
      <div className="flex flex-wrap gap-4 mt-4">
        <div>
          <SectionTitle>📚 绘本主题 * （可多选）</SectionTitle>
          <div className="flex flex-wrap gap-3 mx-32">
            {pictureBookThemeOptions.map((option) => (
              <div key={option.id} className="flex-1 min-w-[calc(50%-6px)]">
                <OptionCard
                  selected={selectedPictureBookTheme === option.id}
                  onClick={() => setSelectedPictureBookTheme(option.id)}
                >
                  <OptionTitle
                    selected={selectedPictureBookTheme === option.id}
                  >
                    <div className="flex  gap-4">
                      <div>{option.icon}</div>
                      <div className="flex flex-col items-start">
                        <div>{option.title}</div>
                        <div>{option.desc}</div>
                      </div>
                    </div>
                  </OptionTitle>
                </OptionCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

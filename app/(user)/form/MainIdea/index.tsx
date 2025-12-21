"use client";

import { useState } from "react";
import { SectionTitle, OptionGroup } from "./style";
import { MainIdeaIcon } from "./icon";
export default function MainIdea() {
  const [storyLine, setStoryLine] = useState<string | null>(null);

  return (
    <>
      <div className="flex flex-wrap gap-4 mt-4">
        <div>
          <SectionTitle>
            <div className="flex justify-between w-full">
              <div>💡 中心思想 *</div>
              <div className="bg-purple-300 text-sm text-white px-4 py-2 rounded-md flex items-center gap-2">
                <MainIdeaIcon />
                AI生成
              </div>
            </div>
          </SectionTitle>
          <OptionGroup>
            <textarea
              className="w-[825px] mx-0 px-4 py-4 rounded-lg border-2 border-yellow-200 hover:border-pink-300 min-h-[60px] text-left align-top resize-none box-border block"
              value={storyLine || ""}
              onChange={(e) => setStoryLine(e.target.value)}
              placeholder="例如：学会分享、友谊的重要性、勇敢面对困难..."
              rows={1}
            ></textarea>
          </OptionGroup>
        </div>
      </div>
    </>
  );
}

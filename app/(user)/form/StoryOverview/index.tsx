"use client";

import { useState } from "react";
import {
  FormTitle,
  FormSubtitle,
  SectionTitle,
  OptionGroup,
  OptionCard,
  OptionTitle,
  OptionDesc,
} from "./style";
import { Input } from "antd";

export default function StoryOverview() {
  const [storyLine, setStoryLine] = useState<string | null>(null);

  return (
    <>
      <div className="flex flex-wrap gap-4 mt-4">
        <div>
          <SectionTitle>
            <div className="flex justify-between">
              <div>✍️ 故事概述 *</div>
              <div>AI美化</div>
            </div>
          </SectionTitle>
          <OptionGroup>
            <textarea
              className="w-[825px] mx-0 px-4 py-4 rounded-lg border-2 border-yellow-200 hover:border-pink-300 min-h-[300px] text-left align-top resize-none box-border block"
              value={storyLine || ""}
              onChange={(e) => setStoryLine(e.target.value)}
              placeholder="请输入故事概述..."
              rows={10}
            ></textarea>
          </OptionGroup>
        </div>
      </div>
    </>
  );
}

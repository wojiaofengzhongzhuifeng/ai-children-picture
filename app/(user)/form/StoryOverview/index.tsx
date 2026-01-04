'use client';

import { SectionTitle, OptionGroup } from './style';
import { StoryOverviewIcon } from './icon';
import { StoryOverviewProps } from '../pageApi';

export default function StoryOverview({ value, onChange }: StoryOverviewProps) {
  return (
    <>
      <div className="flex flex-wrap gap-4 mt-4">
        <div>
          <SectionTitle>
            <div className="flex justify-between w-full">
              <div>✍️ 故事概述 *</div>
              <div className="bg-purple-300 text-sm text-white px-4 py-2 rounded-md flex items-center gap-2">
                <StoryOverviewIcon />
                AI美化
              </div>
            </div>
          </SectionTitle>
          <OptionGroup>
            <textarea
              className="w-[825px] mx-0 px-4 py-4 rounded-lg border-2 border-yellow-200 hover:border-pink-300 min-h-[120px] text-left align-top resize-none box-border block"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="请简要描述您想要的故事情节，例如：一只小兔子学会分享玩具的故事..."
              rows={1}
            ></textarea>
          </OptionGroup>
        </div>
      </div>
    </>
  );
}

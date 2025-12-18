import {
  CtaPrimaryButtonFooter,
  HeroSubtitleFooter,
  HeroTitleFooter,
  PageWrapperFooter,
  Section,
} from "@/app/(user)/style";
import { PageFootIcon, PageFootTickIcon } from "../icon";

export default function PageFoot() {
  return (
    <PageWrapperFooter>
      <Section>
        <HeroTitleFooter>准备好开始创作了吗？</HeroTitleFooter>
        <HeroSubtitleFooter>
          加入数千位家长和教师，为孩子创作独一无二的绘本故事
        </HeroSubtitleFooter>
      </Section>
      <Section className="mt-10">
        <div className="gap-4 flex justify-center">
          <CtaPrimaryButtonFooter>
            <p className="text-orange-600 text-base flex items-center gap-2">
              <PageFootIcon />
              立即开始创作
              <PageFootTickIcon />
            </p>
          </CtaPrimaryButtonFooter>
        </div>
      </Section>
      <div className="mt-10 text-center">
        <HeroSubtitleFooter>
          🎁 完全免费使用 · 无需信用卡 · 无限创作
        </HeroSubtitleFooter>
      </div>
    </PageWrapperFooter>
  );
}

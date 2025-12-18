import {
  PageFooterItem,
  PageFooterSubtitle,
  PageFooterTitle,
  PageFooterWrapper,
  Section,
} from "@/app/(user)/style";
import { PageFooterIcon } from "../icon";

export default function PageFooter() {
  return (
    <PageFooterWrapper>
      <Section>
        <PageFooterTitle>
          <PageFooterIcon />
          儿童绘本创作平台
        </PageFooterTitle>  
        <PageFooterItem>
          让每个孩子都能拥有属于自己的故事世界
        </PageFooterItem>
      </Section>

      <div className="mt-10 text-center">
        <PageFooterSubtitle>
          © 2024 儿童绘本创作平台. AI 驱动的个性化绘本生成工具
        </PageFooterSubtitle>
      </div>
    </PageFooterWrapper>
  );
}

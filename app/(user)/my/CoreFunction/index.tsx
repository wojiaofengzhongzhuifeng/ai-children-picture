import { Section, HeroSection, HeroTitle } from "@/app/(user)/style";
import { ArtisticIcon, ArtisticTickIcon, IntelligentIcon, IntelligentTickIcon, ProfessionalIcon, ProfessionalTickIcon } from "../icon";

export default function CoreFeatures() {
  return (
    <Section className="mt-16">
      <div className="flex gap-4 justify-center w-full">
        <HeroSection>
          <HeroTitle>核心功能</HeroTitle>
          <div className="text-2xl text-gray-600 mb-16">
            强大的创作工具，让绘本制作变得简单有趣
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* 卡片 1：AI 智能生成 */}
            <div className="flex justify-center w-full">
              <div className="flex flex-col bg-orange-50 h-full">
                <div className="border-4 border-orange-200 rounded-xl p-6 max-w-sm h-full flex flex-col">
                  <IntelligentIcon />
                  <div className="text-2xl text-orange-600 flex mb-5 ml-2">
                    AI智能生成
                  </div>
                  <div className="text-sm text-gray-600 flex-wrap ml-1 ">
                    只需填写简单信息，AI 自动生成完整的故事情节和精美插图，
                    每个故事都独一无二
                  </div>
                  <div className="flex items-center gap-2 mt-5 text-orange-500">
                    <IntelligentTickIcon />
                    10页完整故事
                  </div>
                </div>
              </div>
            </div>

            {/* 卡片 2：多样插画风格 */}
            <div className="flex justify-center w-full">
              <div className="flex flex-col bg-pink-50 h-full">
                <div className="border-4 border-pink-200 rounded-xl p-6 max-w-sm h-full flex flex-col">
                  <ArtisticIcon />
                  <div className="text-2xl text-pink-600 flex mb-5 ml-2">
                    多样插画风格
                  </div>
                  <div className="text-sm text-gray-600 flex-wrap ml-1 ">
                  支持水彩、蜡笔、卡通、3D粘土、剪纸拼贴等多种艺术风格，满足不同审美需求
                  </div>
                  <div className="flex items-center gap-2 mt-5 text-pink-500">
                    <ArtisticTickIcon />
                    5种艺术风格
                  </div>
                </div>  
              </div>
            </div>

            {/* 卡片 3：专业编辑器 */}
            <div className="flex justify-center w-full">
              <div className="flex flex-col bg-purple-50 h-full">
                <div className="border-4 border-purple-200 rounded-xl p-6 max-w-sm h-full flex flex-col">
                  <ProfessionalIcon />
                  <div className="text-2xl text-purple-600 flex mb-5 ml-2">
                    专业编辑器
                  </div>
                  <div className="text-sm text-gray-600 flex-start ml-1 ">
                  PPT风格的可视化编辑器，轻松修改每一页的图片和文字，支持AI优化
                  </div>
                  <div className="flex items-center gap-2 mt-5 text-purple-500">
                    <ProfessionalTickIcon />
                    即时预览编辑
                  </div>
                </div>
              </div>
            </div>

          </div>
        </HeroSection>
      </div>
    </Section>
  );
}

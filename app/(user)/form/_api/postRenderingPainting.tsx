import { ApiConfig, prefixUrl, request } from "./common";

export interface RenderingPaintingRequest {
  central_idea: string;
  child_age: string;
  illustration_style: string;
  themes: string[];
  story_overview: string;
}

export interface RenderingPaintingResponse {
  central_idea: string;
  child_age: string;
  child_age_label: string;
  illustration_style: string;
  illustration_style_label: string;
  story_overview: string;
  themes: string[];
  themes_label: string;
  sceneCount: number;
  scenes: { text: string; img_text_prompt: string }[];
}

export const postRenderingPaintingApiConfig: ApiConfig = {
  url: `${prefixUrl}/generate-ai-children-picture`,
  method: "POST",
  manual: false,
  showError: true,
};

export const postRenderingPainting = async (
  data: RenderingPaintingRequest
) => {
  try {
    const response = await request(
      postRenderingPaintingApiConfig.url,
      postRenderingPaintingApiConfig.method,
      data
    );
    return {
      success: true,
      message: "请求成功",
      data: response,
    };
  } catch (error: any) {
    console.error("API 请求错误:", error);
    // 抛出错误让 useRequest 处理
    throw new Error(error.message || "请求失败");
  }
};

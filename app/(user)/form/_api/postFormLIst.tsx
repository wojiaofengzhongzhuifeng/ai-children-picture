import { ApiConfig, getAuthHeaders, prefixUrl } from "./common";
import axios from "axios";

export interface PostFormList {
  child_age: string;
  illustration_style: string;
  themes: string[];
  story_overview: string;
  central_idea: string;
}

export const postFormListApiConfig: ApiConfig = {
  // 对应后端：POST /api/form/list
  url: `${prefixUrl}/create-prompt`,
  method: "POST",
  manual: false,
  showError: true,
};

export const postFormList = async (data: PostFormList) => {
  try {
    const response = await axios.post(postFormListApiConfig.url, data, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
    return {
      success: true,
      message: "请求成功",
      data: response.data,
    };
  } catch (error: any) {
    console.error("API 请求错误:", error);
    // 抛出错误让 useRequest 处理
    if (error.response) {
      // 服务器返回了错误响应
      throw new Error(
        error.response.data?.error || error.response.data?.message || "请求失败"
      );
    } else if (error.request) {
      // 请求已发出但没有收到响应
      throw new Error("网络错误，请检查网络连接");
    } else {
      // 其他错误
      throw new Error(error.message || "请求失败");
    }
  }
};

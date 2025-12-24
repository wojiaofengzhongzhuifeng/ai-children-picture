import { toast } from "@/hooks/use-toast";
import { RenderingPaintingRequest, RenderingPaintingResponse, postRenderingPainting } from "../../form/_api/postRenderingPainting";
import { useRequest } from "ahooks";
import { useEffect } from "react";

export const usePostRenderingPaintingHooks = () => {
  const { data: renderingPaintingData, error, loading, run } = useRequest<
    RenderingPaintingResponse,
    [RenderingPaintingRequest]
  >(async (params: RenderingPaintingRequest) => {
    const response = await postRenderingPainting(params);
    return response.data;
  }, {
    manual: true, // 手动触发，不自动执行
  });

  useEffect(() => {
    console.log("data", renderingPaintingData);
    if (error) {
      toast({
        title: "错误",
        description: error.message || "请求失败",
        variant: "destructive",
      });
    }
  }, [error]);

  return {
    data: renderingPaintingData,
    error: error?.message,
    loading,
    run: (params: RenderingPaintingRequest) => {
      run(params);
    },
  };
};

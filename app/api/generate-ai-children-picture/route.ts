import { NextResponse } from 'next/server'
import { GoogleGenAI } from "@google/genai";

export async function GET() {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY // ✅ 修正拼写：GEMINI 不是 GEMENI
    });

    const prompt =
      "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
    });

    // 提取图片数据
    if (!response.candidates || response.candidates.length === 0) {
      return NextResponse.json({ success: false, error: "No candidates returned" }, { status: 500 });
    }

    const parts = response.candidates[0]?.content?.parts;
    if (!parts) {
      return NextResponse.json({ success: false, error: "No content parts found" }, { status: 500 });
    }

    for (const part of parts) {
      if (part.text) {
        console.log(part.text);
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        // ✅ 返回 base64 图片给前端，而不是写文件到服务器
        return NextResponse.json({
          success: true,
          imageData: `data:image/png;base64,${imageData}`,
          mimeType: part.inlineData.mimeType
        });
      }
    }

    // 如果没有图片数据
    return NextResponse.json({ success: false, error: "No image generated" }, { status: 500 });

  } catch (error: any) {
    console.error('Gemini API Error:', error);
    
    // ✅ 优雅处理配额超限错误
    if (error.status === 429) {
      return NextResponse.json(
        { 
          success: false, 
          error: "API配额已用完，请稍后重试或升级计划",
          retryAfter: error.details?.retryDelay || "30s"
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || "生成图片失败" },
      { status: 500 }
    );
  }
}  
import {
  ITextGenerator,
  TextGenerationParams,
  TextGenerationResult,
} from '@/lib/services/ai';

export class ZhipuTextGenerator implements ITextGenerator {
  private apiKey: string;
  private baseUrl = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generate(params: TextGenerationParams): Promise<TextGenerationResult> {
    const startTime = Date.now();

    // 检查 API Key 是否有效
    if (!this.apiKey || this.apiKey === 'placeholder') {
      throw new Error('Zhipu API Key 未配置或无效');
    }

    // 构建请求体
    const requestBody = {
      model: params.model || 'glm-4-flash',
      messages: [
        ...(params.context
          ? [{ role: 'system' as const, content: params.context }]
          : []),
        { role: 'user' as const, content: params.prompt },
      ],
      max_tokens: params.maxLength || 1000,
      temperature: params.temperature || 0.7,
      stream: false,
    };

    console.log('正在调用 Zhipu 文本生成 API:', {
      url: this.baseUrl,
      model: requestBody.model,
      prompt:
        requestBody.messages[
          requestBody.messages.length - 1
        ]?.content?.substring(0, 50) + '...',
      maxLength: requestBody.max_tokens,
      temperature: requestBody.temperature,
    });

    let response;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时

      response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
    } catch (fetchError) {
      console.error('Zhipu 文本生成 API 网络错误:', fetchError);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        throw new Error('请求超时: 文本生成时间过长，请重试');
      }
      throw new Error(
        `网络连接失败: ${fetchError instanceof Error ? fetchError.message : '未知网络错误'}`
      );
    }

    console.log('Zhipu 文本生成 API 响应状态:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Zhipu 文本生成 API 错误响应:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });

      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: { message: errorText } };
      }

      // 根据错误类型提供更友好的错误信息
      if (response.status === 401) {
        throw new Error('Zhipu API Key 无效或已过期，请检查配置');
      } else if (response.status === 429) {
        throw new Error('请求过于频繁，请稍后重试');
      } else if (response.status === 402) {
        throw new Error('账户余额不足，请充值后重试');
      } else {
        throw new Error(
          `Zhipu API 错误 (${response.status}): ${errorData.error?.message || response.statusText}`
        );
      }
    }

    const data = await response.json();
    const generationTime = Date.now() - startTime;

    // 解析响应数据
    const generatedText = data.choices?.[0]?.message?.content || data.result;

    if (!generatedText) {
      console.error('Zhipu 文本生成 API 返回数据结构:', data);
      throw new Error('未获取到生成的文本内容');
    }

    console.log('文本生成成功:', {
      generationTime: `${generationTime}ms`,
      model: data.model || requestBody.model,
      textLength: generatedText.length,
    });

    return {
      id: data.id || `glm_${Date.now()}`,
      text: generatedText,
      model: data.model || requestBody.model,
      prompt: params.prompt,
      generationTime,
      metadata: {
        context: params.context,
        maxLength: params.maxLength,
        temperature: params.temperature,
        usage: data.usage,
        cost: 0.001, // 假设每次使用费用 0.001 元
        apiResponse: data,
      },
    };
  }

  async getModels(): Promise<string[]> {
    // 智谱支持的文本生成模型
    return ['glm-4-flash', 'glm-4', 'glm-4-air', 'glm-3-turbo'];
  }

  async isAvailable(): Promise<boolean> {
    try {
      if (!this.apiKey || this.apiKey === 'placeholder') {
        return false;
      }

      // 测试 API 可用性
      const testResponse = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'glm-4-flash',
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 10,
        }),
      });

      // 如果返回 401 或 402，说明 API 可用但需要认证或付费
      return testResponse.status !== 0;
    } catch (error) {
      console.warn('Zhipu 文本生成 API 可用性检查失败:', error);
      return false;
    }
  }
}

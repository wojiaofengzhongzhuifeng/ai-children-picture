import { IImageGenerator, ImageGenerationParams, ImageGenerationResult } from '@/lib/services/ai'

export class ZhipuImageGenerator implements IImageGenerator {
  private apiKey: string
  private baseUrl = 'https://open.bigmodel.cn/api/paas/v4/images/generations'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async generate(params: ImageGenerationParams): Promise<ImageGenerationResult> {
    const startTime = Date.now()

    // 检查 API Key 是否有效
    if (!this.apiKey || this.apiKey === 'placeholder') {
      throw new Error('Zhipu API Key 未配置或无效')
    }

    // CogView-4 支持中英文双语输入，无需长度限制
    const requestBody = {
      model: params.model || 'cogview-4',
      prompt: params.prompt,
      negative_prompt: params.negativePrompt || '',
      // CogView-4 支持自定义尺寸，这里提供常用尺寸
      size: params.width && params.height ? `${params.width}x${params.height}` : '1024x1024',
      steps: params.steps || 50, // CogView-4 推荐步数
      seed: params.seed || Math.floor(Math.random() * 1000000),
      // 可选参数：质量、风格等
      quality: params.quality || 'standard',
      style: params.style || 'natural'
    }

    console.log('正在调用 Zhipu CogView-4 API:', {
      url: this.baseUrl,
      model: requestBody.model,
      prompt: requestBody.prompt.substring(0, 50) + (requestBody.prompt.length > 50 ? '...' : ''),
      size: requestBody.size,
      steps: requestBody.steps
    })

    let response
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60秒超时，图片生成需要更长时间

      response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      })

      clearTimeout(timeoutId)
    } catch (fetchError) {
      console.error('Zhipu API 网络错误:', fetchError)
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        throw new Error('请求超时: 图片生成时间过长，请重试')
      }
      throw new Error(`网络连接失败: ${fetchError instanceof Error ? fetchError.message : '未知网络错误'}`)
    }

    console.log('Zhipu API 响应状态:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Zhipu API 错误响应:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })

      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { error: { message: errorText } }
      }

      // 根据错误类型提供更友好的错误信息
      if (response.status === 401) {
        throw new Error('Zhipu API Key 无效或已过期，请检查配置')
      } else if (response.status === 429) {
        throw new Error('请求过于频繁，请稍后重试')
      } else if (response.status === 402) {
        throw new Error('账户余额不足，请充值后重试')
      } else {
        throw new Error(`Zhipu API 错误 (${response.status}): ${errorData.error?.message || response.statusText}`)
      }
    }

    const data = await response.json()
    const generationTime = Date.now() - startTime

    // CogView-4 返回数据结构处理
    let imageUrl = data.data?.[0]?.url || data.image_url || data.image_urls?.[0]

    if (!imageUrl) {
      console.error('Zhipu API 返回数据结构:', data)
      throw new Error('未获取到生成的图片URL')
    }

    console.log('图片生成成功:', {
      generationTime: `${generationTime}ms`,
      model: data.model || requestBody.model,
      imageUrl: imageUrl.substring(0, 50) + '...'
    })

    return {
      id: data.id || `cogview_${Date.now()}`,
      imageUrl,
      thumbnailUrl: imageUrl, // CogView-4 可能不提供缩略图，暂时使用原图
      model: data.model || requestBody.model,
      prompt: params.prompt,
      generationTime,
      metadata: {
        negativePrompt: params.negativePrompt,
        width: params.width,
        height: params.height,
        steps: params.steps,
        seed: requestBody.seed,
        quality: requestBody.quality,
        style: requestBody.style,
        cost: 0.06, // CogView-4 每次使用费用 0.06 元
        apiResponse: data
      }
    }
  }

  async getModels(): Promise<string[]> {
    // 智谱支持的图片生成模型，包含最新版本
    return ['cogview-4', 'cogview-3', 'cogview-3-plus']
  }

  async isAvailable(): Promise<boolean> {
    try {
      if (!this.apiKey || this.apiKey === 'placeholder') {
        return false
      }

      // 测试 API 可用性
      const testResponse = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'cogview-4',
          prompt: 'test',
          size: '1024x1024'
        })
      })

      // 如果返回 401 或 402，说明 API 可用但需要认证或付费
      return testResponse.status !== 0
    } catch (error) {
      console.warn('Zhipu API 可用性检查失败:', error)
      return false
    }
  }
}

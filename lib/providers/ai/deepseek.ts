import { IImageGenerator, ImageGenerationParams, ImageGenerationResult } from '@/lib/services/ai'

export class DeepSeekImageGenerator implements IImageGenerator {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async generate(params: ImageGenerationParams): Promise<ImageGenerationResult> {
    const startTime = Date.now()

    console.log('使用模拟图片生成器 - DeepSeek 主要用于文本生成，不支持图片生成')

    // 模拟生成时间
    await new Promise(resolve => setTimeout(resolve, 2000))

    const generationTime = Date.now() - startTime

    // 生成一个模拟的图片 URL (使用 placeholder 服务)
    const imageUrl = `https://picsum.photos/${params.width || 1024}/${params.height || 1024}?random=${Date.now()}`

    return {
      id: `mock_${Date.now()}`,
      imageUrl,
      thumbnailUrl: imageUrl,
      model: 'mock-generator',
      prompt: params.prompt,
      generationTime,
      metadata: {
        negativePrompt: params.negativePrompt,
        width: params.width,
        height: params.height,
        steps: params.steps,
        seed: params.seed,
        note: '这是使用模拟图片生成器生成的结果。如需真实的AI图片生成，请配置 Zhipu API Key。'
      }
    }
  }

  async getModels(): Promise<string[]> {
    return ['mock-generator']
  }

  async isAvailable(): Promise<boolean> {
    return true // 模拟生成器总是可用
  }
}
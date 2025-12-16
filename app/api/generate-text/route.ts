import { NextRequest, NextResponse } from 'next/server'
import { ZhipuTextGenerator } from '@/lib/providers/ai/text-generator'

// 创建文本生成器实例
const textGenerator = new ZhipuTextGenerator(process.env.ZHIPU_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, context, maxLength, temperature, model } = body

    if (!prompt || prompt.trim() === '') {
      return NextResponse.json(
        { error: '请提供文本描述' },
        { status: 400 }
      )
    }

    // 调用AI生成文本
    const result = await textGenerator.generate({
      prompt,
      context,
      maxLength: maxLength || 1000,
      temperature: temperature || 0.7,
      model: model || 'glm-4-flash'
    })

    return NextResponse.json({
      success: true,
      text: result.text,
      model: result.model,
      generationTime: result.generationTime,
      textId: result.id
    })
  } catch (error) {
    console.error('文本生成失败:', error)

    return NextResponse.json(
      {
        error: '文本生成失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // 检查API可用性
    const isAvailable = await textGenerator.isAvailable()

    if (!isAvailable) {
      return NextResponse.json(
        { error: '文本生成服务不可用，请检查API配置' },
        { status: 503 }
      )
    }

    // 获取可用模型
    const models = await textGenerator.getModels()

    return NextResponse.json({
      success: true,
      models,
      available: isAvailable
    })
  } catch (error) {
    console.error('获取文本生成模型失败:', error)
    return NextResponse.json(
      {
        error: '获取可用模型失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}
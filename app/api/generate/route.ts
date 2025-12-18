import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { imageGenerator, imageRepository, generationRepository } from '@/lib'
import { Database } from '@/types/database'

export async function POST(request: NextRequest) {
  try {
    // 检查是否配置了有效的 Supabase URL
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      console.warn('Using mock mode - Supabase not properly configured')
    }

    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-key'
    )
    
    // 临时移除登录检查
    // 获取当前用户
    // const { data: { user }, error: authError } = await supabase.auth.getUser()

    // if (authError || !user) {
    //   return NextResponse.json(
    //     { error: '未授权访问' },
    //     { status: 401 }
    //   )
    // }

    // 临时使用固定用户ID进行测试
    const user = {
      id: 'test-user-id-123'
    }

    const body = await request.json()
    const { prompt, negativePrompt, model, size } = body

    if (!prompt || prompt.trim() === '') {
      return NextResponse.json(
        { error: '请提供图片描述' },
        { status: 400 }
      )
    }

    // 解析尺寸
    let width = 1024
    let height = 1024
    
    if (size && size.includes('x')) {
      const [w, h] = size.split('x').map(Number)
      if (!isNaN(w) && !isNaN(h)) {
        width = w
        height = h
      }
    }

    // 创建生成记录
    const generation = await generationRepository.create({
      user_id: user.id,
      model: model || 'cogview-3',
      prompt,
      params: {
        negativePrompt,
        width,
        height
      },
      status: 'processing'
    })

    try {
      // 调用AI生成图片
      const result = await imageGenerator.generate({
        prompt,
        negativePrompt,
        model: model || 'cogview-3',
        width,
        height
      })

      // 保存图片记录
      const image = await imageRepository.create({
        user_id: user.id,
        prompt,
        negative_prompt: negativePrompt,
        image_url: result.imageUrl,
        model: result.model,
        width,
        height,
        is_public: false, // 默认私有
        status: 'success'
      })

      // 更新生成记录
      await generationRepository.update(generation.id, {
        image_id: image.id,
        status: 'success',
        generation_time: result.generationTime
      })

      return NextResponse.json({
        success: true,
        imageId: image.id,
        imageUrl: result.imageUrl,
        generationId: generation.id
      })
    } catch (aiError) {
      console.error('AI生成失败:', aiError)
      
      // 更新生成记录为失败状态
      await generationRepository.update(generation.id, {
        status: 'failed',
        error_message: aiError instanceof Error ? aiError.message : '未知错误'
      })

      return NextResponse.json(
        { 
          error: '图片生成失败',
          details: aiError instanceof Error ? aiError.message : '未知错误'
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('生成API错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

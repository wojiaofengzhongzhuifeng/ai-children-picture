'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Loader2, Sparkles, Download, Share } from 'lucide-react'
import { TextGenerator } from '@/components/TextGenerator'
// import { toast } from '@/hooks/use-toast'
// import { authService } from '@/lib'

export default function HomePage() {
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [model, setModel] = useState('cogview-4')
  const [size, setSize] = useState('1024x1024')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('请输入描述：请输入您想要生成的图片描述')
      return
    }

    // 临时移除登录检查
    // const currentUser = await authService.getCurrentUser()
    // if (!currentUser) {
    //   alert('请先登录：生成图片需要登录账号')
    //   return
    // }

    setIsGenerating(true)
    setGeneratedImage(null)

    try {
      // 这里调用API生成图片
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          negativePrompt,
          model,
          size,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || '生成失败')
      }

      const data = await response.json()
      setGeneratedImage(data.imageUrl)

      alert('生成成功：您的图片已成功生成')
    } catch (error) {
      console.error('生成失败:', error)
      alert('生成失败：' + (error instanceof Error ? error.message : '未知错误'))
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!generatedImage) return
    
    const link = document.createElement('a')
    link.href = generatedImage
    link.download = `ai-generated-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShare = async () => {
    if (!generatedImage) return
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI生成的图片',
          text: prompt,
          url: window.location.href,
        })
      } catch (error) {
        console.error('分享失败:', error)
      }
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href)
      alert('链接已复制：页面链接已复制到剪贴板')
    }
  }

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            AI图片生成器
          </h1>
          <p className="text-xl text-muted-foreground">
            输入文字描述，AI为您生成精美图片
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 输入区域 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                图片描述
              </CardTitle>
              <CardDescription>
                详细描述您想要生成的图片内容
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">描述</Label>
                <Textarea
                  id="prompt"
                  placeholder="例如：一只可爱的橙色小猫坐在窗台上，阳光透过窗户洒在它身上，高清摄影风格"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="negative-prompt">负面描述（可选）</Label>
                <Textarea
                  id="negative-prompt"
                  placeholder="描述您不希望在图片中出现的内容"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  rows={2}
                  className="resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="model">模型</Label>
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择模型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cogview-4">CogView-4 (智谱AI)</SelectItem>
                      <SelectItem value="cogview-3">CogView-3 (智谱AI)</SelectItem>
                      <SelectItem value="mock-generator">模拟生成器 (测试用)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size">尺寸</Label>
                  <Select value={size} onValueChange={setSize}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择尺寸" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="512x512">512×512</SelectItem>
                      <SelectItem value="1024x1024">1024×1024</SelectItem>
                      <SelectItem value="1280x720">1280×720</SelectItem>
                      <SelectItem value="720x1280">720×1280</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !prompt.trim()}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    生成图片
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* 结果区域 */}
          <Card>
            <CardHeader>
              <CardTitle>生成结果</CardTitle>
              <CardDescription>
                AI生成的图片将显示在这里
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isGenerating ? (
                <div className="flex items-center justify-center h-64 bg-muted rounded-md">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">正在生成图片，请稍候...</p>
                  </div>
                </div>
              ) : generatedImage ? (
                <div className="space-y-4">
                  <div className="relative overflow-hidden rounded-md bg-muted">
                    <img
                      src={generatedImage}
                      alt="Generated image"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                      <Download className="mr-2 h-4 w-4" />
                      下载
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share className="mr-2 h-4 w-4" />
                      分享
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground">
                    输入描述并点击生成按钮开始创作
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* AI文本生成模块 */}
        <div className="mt-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              AI 文本生成
            </h2>
            <p className="text-lg text-muted-foreground">
              输入简单的提示词，AI为您生成详细的文本内容，可用于图片生成提示词扩展
            </p>
          </div>
          <TextGenerator />
        </div>
      </div>
    </div>
  )
}

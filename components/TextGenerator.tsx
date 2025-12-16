'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Sparkles, Copy, RefreshCw } from 'lucide-react'

interface TextGeneratorProps {
  className?: string
}

export function TextGenerator({ className }: TextGeneratorProps) {
  const [prompt, setPrompt] = useState('')
  const [generatedText, setGeneratedText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [model, setModel] = useState('glm-4-flash')
  const [maxLength, setMaxLength] = useState('500')
  const [temperature, setTemperature] = useState('0.7')
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('请输入提示词')
      return
    }

    setIsGenerating(true)
    setError('')
    setGeneratedText('')

    try {
      const response = await fetch('/api/generate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          model,
          maxLength: parseInt(maxLength),
          temperature: parseFloat(temperature),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.details || data.error || '生成失败')
      }

      setGeneratedText(data.text)
    } catch (err) {
      console.error('Text generation error:', err)
      setError(err instanceof Error ? err.message : '生成文本时发生错误')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedText)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleExpandPrompt = async () => {
    const expandPrompt = `请将以下提示词进行详细扩展和丰富，使其更加具体和生动，用于AI图片生成：\n\n"${prompt}"`

    setIsGenerating(true)
    setError('')

    try {
      const response = await fetch('/api/generate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: expandPrompt,
          context: '你是一个专业的AI提示词优化师，擅长将简单的提示词扩展为详细、生动的描述。请提供丰富的细节，包括风格、光照、构图、色彩等方面的描述。',
          model: 'glm-4-flash',
          maxLength: 800,
          temperature: 0.8,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.details || data.error || '扩展失败')
      }

      setGeneratedText(data.text)
    } catch (err) {
      console.error('Prompt expansion error:', err)
      setError(err instanceof Error ? err.message : '扩展提示词时发生错误')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI 文本生成
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">输入提示词</Label>
            <Textarea
              id="prompt"
              placeholder="请输入您想要扩展的提示词，例如：一只可爱的猫..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="model">模型</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="glm-4-flash">GLM-4 Flash (快速)</SelectItem>
                  <SelectItem value="glm-4">GLM-4 (标准)</SelectItem>
                  <SelectItem value="glm-4-air">GLM-4 Air (轻量)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxLength">最大长度</Label>
              <Select value={maxLength} onValueChange={setMaxLength}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="200">200 字符</SelectItem>
                  <SelectItem value="500">500 字符</SelectItem>
                  <SelectItem value="1000">1000 字符</SelectItem>
                  <SelectItem value="2000">2000 字符</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">创造性</Label>
              <Select value={temperature} onValueChange={setTemperature}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.3">保守 (0.3)</SelectItem>
                  <SelectItem value="0.7">平衡 (0.7)</SelectItem>
                  <SelectItem value="1.0">创意 (1.0)</SelectItem>
                  <SelectItem value="1.3">超创意 (1.3)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  生成文本
                </>
              )}
            </Button>

            <Button
              onClick={handleExpandPrompt}
              disabled={isGenerating || !prompt.trim()}
              variant="outline"
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  扩展中...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  扩展提示词
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {generatedText && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              生成结果
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                复制
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted rounded-md">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                {generatedText}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
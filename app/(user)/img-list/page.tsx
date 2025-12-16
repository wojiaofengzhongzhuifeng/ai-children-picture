'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Heart, Eye, Search, Filter } from 'lucide-react'
import { Image } from '@/lib'
import { imageRepository } from '@/lib'
import { toast } from '@/hooks/use-toast'

export default function ImageListPage() {
  const [images, setImages] = useState<Image[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [filterModel, setFilterModel] = useState('all')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [likedImages, setLikedImages] = useState<Set<string>>(new Set())

  const fetchImages = async (reset = false) => {
    try {
      setLoading(true)
      const currentPage = reset ? 1 : page
      const limit = 12
      const offset = reset ? 0 : (page - 1) * limit

      let fetchedImages = await imageRepository.findAll({
        isPublic: true,
        limit,
        offset
      })

      // 客户端过滤和排序（实际项目中应该在服务端处理）
      if (searchTerm) {
        fetchedImages = fetchedImages.filter(img => 
          img.prompt.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      if (filterModel !== 'all') {
        fetchedImages = fetchedImages.filter(img => img.model === filterModel)
      }

      fetchedImages.sort((a, b) => {
        if (sortBy === 'created_at') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        } else if (sortBy === 'likes_count') {
          return b.likes_count - a.likes_count
        }
        return 0
      })

      if (reset) {
        setImages(fetchedImages)
        setPage(1)
      } else {
        setImages(prev => [...prev, ...fetchedImages])
      }

      setHasMore(fetchedImages.length === limit)
    } catch (error) {
      console.error('获取图片列表失败:', error)
      toast({
        title: '获取失败',
        description: '无法加载图片列表，请稍后重试',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages(true)
  }, [searchTerm, sortBy, filterModel])

  const handleLoadMore = () => {
    setPage(prev => prev + 1)
    fetchImages()
  }

  const handleLike = async (imageId: string) => {
    try {
      // 这里应该调用API来点赞/取消点赞
      const isLiked = likedImages.has(imageId)
      
      if (isLiked) {
        setLikedImages(prev => {
          const newSet = new Set(prev)
          newSet.delete(imageId)
          return newSet
        })
        
        // 更新图片的点赞数
        setImages(prev => prev.map(img => 
          img.id === imageId 
            ? { ...img, likes_count: Math.max(0, img.likes_count - 1) }
            : img
        ))
      } else {
        setLikedImages(prev => new Set(prev).add(imageId))
        
        // 更新图片的点赞数
        setImages(prev => prev.map(img => 
          img.id === imageId 
            ? { ...img, likes_count: img.likes_count + 1 }
            : img
        ))
      }
    } catch (error) {
      console.error('点赞操作失败:', error)
      toast({
        title: '操作失败',
        description: '无法完成点赞操作，请稍后重试',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">图片广场</h1>
        <p className="text-muted-foreground">
          探索社区创作的精美AI图片
        </p>
      </div>

      {/* 搜索和筛选 */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索图片描述..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="排序方式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">最新发布</SelectItem>
              <SelectItem value="likes_count">最多点赞</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterModel} onValueChange={setFilterModel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="模型筛选" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有模型</SelectItem>
              <SelectItem value="cogview-3">CogView-3</SelectItem>
              <SelectItem value="cogview-3-plus">CogView-3 Plus</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 图片网格 */}
      {loading && images.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-square w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-4 w-full mb-2" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">暂无图片</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image) => (
              <Card key={image.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={image.image_url || ''}
                    alt={image.prompt}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </div>
                <CardContent className="p-4">
                  <p className="text-sm font-medium line-clamp-2 mb-2">
                    {image.prompt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{image.model}</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleLike(image.id)}
                        className={`flex items-center gap-1 ${likedImages.has(image.id) ? 'text-red-500' : ''}`}
                      >
                        <Heart className={`h-3 w-3 ${likedImages.has(image.id) ? 'fill-current' : ''}`} />
                        {image.likes_count}
                      </button>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {image.views_count}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {hasMore && (
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={loading}
              >
                {loading ? '加载中...' : '加载更多'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

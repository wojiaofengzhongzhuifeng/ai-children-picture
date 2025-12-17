# 图片永久化存储 API 测试指南

## 功能概述

API 已修改为：智谱AI生成图片 → 下载图片 → 上传到Supabase Storage → 返回永久URL

## 前置要求

### 1. 确保环境变量已配置

在 `.env.local` 文件中：

```bash
# 智谱 AI
ZHIPU_API_KEY=your_zhipu_api_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. 确保 Supabase Storage Bucket 已创建

在 Supabase 控制台中：

1. 进入 Storage 页面
2. 创建名为 `images` 的 bucket
3. 设置为 **Public** （公开访问）
4. 确保有上传权限

## 测试步骤

### 方法 1: 使用 curl 测试

```bash
curl -X POST http://localhost:3000/api/generate-ai-children-picture \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "一只可爱的小猫",
    "negativePrompt": "模糊、低质量",
    "model": "cogview-4",
    "size": "1024x1024"
  }'
```

### 方法 2: 使用前端页面测试

创建一个测试页面或在浏览器控制台中：

```javascript
fetch('/api/generate-ai-children-picture', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: '一只可爱的小猫',
    negativePrompt: '模糊、低质量',
    model: 'cogview-4',
    size: '1024x1024'
  })
})
.then(res => res.json())
.then(data => {
  console.log('成功:', data)
  // 在新标签页打开图片
  if (data.imageUrl) {
    window.open(data.imageUrl, '_blank')
  }
})
.catch(err => console.error('错误:', err))
```

## 预期返回结果

### 成功上传到 Supabase

```json
{
  "success": true,
  "imageUrl": "https://your-project.supabase.co/storage/v1/object/public/images/ai-children/1734451200000-abc123.png",
  "originalUrl": "https://maas-watermark-prod.cn-wlcb.ufileos.com/...",
  "storagePath": "ai-children/1734451200000-abc123.png",
  "model": "cogview-4",
  "generationTime": 8439,
  "metadata": {
    "prompt": "一只可爱的小猫",
    "negativePrompt": "模糊、低质量",
    "width": 1024,
    "height": 1024,
    "steps": 50,
    "seed": 101421
  }
}
```

### Supabase 未配置（降级）

```json
{
  "success": true,
  "imageUrl": "https://maas-watermark-prod.cn-wlcb.ufileos.com/...",
  "model": "cogview-4",
  "generationTime": 8439,
  "warning": "图片存储服务未配置，使用临时URL",
  "metadata": { ... }
}
```

## 验证要点

### ✅ 核心功能验证

1. **图片是否成功生成**
   - 检查返回的 `success` 字段为 `true`
   - 检查 `imageUrl` 是否存在

2. **URL 是否为永久地址**
   - ✅ 正确：`https://your-project.supabase.co/storage/v1/object/public/images/...`
   - ❌ 错误：`https://maas-watermark-prod.cn-wlcb.ufileos.com/...` （带 Expires 参数）

3. **图片是否可访问**
   - 在浏览器中打开 `imageUrl`
   - 图片应该能正常显示
   - 没有水印（Supabase 存储的版本）

4. **Supabase Storage 中是否存在文件**
   - 登录 Supabase 控制台
   - 进入 Storage → images bucket
   - 检查 `ai-children/` 目录下是否有新文件

### ✅ 错误处理验证

1. **下载失败场景**
   - 模拟：修改代码让智谱返回无效URL
   - 预期：返回 500 错误，提示"下载生成的图片失败"

2. **上传失败场景**
   - 模拟：关闭 Supabase bucket 的写权限
   - 预期：降级返回智谱临时URL，带 `warning` 字段

3. **配额不足场景**
   - 智谱API返回 402
   - 预期：返回 402 错误，提示"账户余额不足"

## 性能监控

观察控制台日志：

```
正在调用智谱 CogView-4 API: { model: 'cogview-4', prompt: '...', size: '1024x1024' }
智谱图片生成成功，开始下载并上传到 Supabase: { generationTime: '8439ms', zhipuUrl: '...' }
图片下载成功，大小: 1234567 bytes
开始上传到 Supabase Storage: ai-children/1734451200000-abc123.png
上传成功，永久URL: https://...
```

## 常见问题

### Q1: 返回的还是智谱临时URL？

**原因：** Supabase 环境变量未配置或包含 "placeholder"

**解决：** 
1. 检查 `.env.local` 中的 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. 重启开发服务器（`npm run dev`）

### Q2: 提示"上传失败"？

**可能原因：**
1. `images` bucket 不存在
2. bucket 权限设置不正确
3. Supabase 免费配额用完

**解决：**
1. 在 Supabase 控制台创建 `images` bucket
2. 设置 bucket 为 Public
3. 检查 Storage 配额使用情况

### Q3: 图片能生成但打不开永久URL？

**原因：** bucket 未设置为 Public

**解决：**
1. Supabase 控制台 → Storage → images
2. 点击 bucket 设置
3. 勾选 "Public bucket"

## 测试完成标准

- [ ] 图片成功生成
- [ ] 返回的是 Supabase 永久URL（不是智谱临时URL）
- [ ] 图片在浏览器中可正常访问
- [ ] Supabase Storage 中能看到上传的文件
- [ ] 图片无水印
- [ ] 多次调用不会覆盖之前的图片（文件名唯一）
- [ ] 错误场景能正确降级（返回临时URL）

---

测试完成后，请将结果反馈给开发团队。


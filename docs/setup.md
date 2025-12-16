# 项目配置与启动指南

本文档详细说明如何配置和启动 AI 图片生成 SaaS 应用。

## 目录

1. [环境准备](#环境准备)
2. [Supabase 配置](#supabase-配置)
3. [智谱 AI 配置](#智谱-ai-配置)
4. [项目启动](#项目启动)
5. [常见问题](#常见问题)

## 环境准备

### 1. 安装依赖

确保已安装 Node.js 18+ 和 pnpm：

```bash
# 安装 pnpm（如果尚未安装）
npm install -g pnpm

# 安装项目依赖
pnpm install
```

### 2. 创建环境变量文件

在项目根目录创建 `.env.local` 文件：

```bash
# 复制示例文件
cp .env.example .env.local
```

## Supabase 配置

### 1. 创建 Supabase 项目

1. 访问 [Supabase 官网](https://supabase.com)
2. 点击 "Start your project" 或 "New Project"
3. 选择组织，输入项目名称（如：ai-image-generator）
4. 设置数据库密码（请妥善保存）
5. 选择地区（推荐选择离你最近的地区）
6. 点击 "Create new project"

### 2. 获取 API 密钥

项目创建后：

1. 进入项目仪表盘
2. 点击左侧菜单的 "Settings" > "API"
3. 复制以下信息到 `.env.local`：
   - Project URL（作为 `NEXT_PUBLIC_SUPABASE_URL`）
   - anon public（作为 `NEXT_PUBLIC_SUPABASE_ANON_KEY`）
   - service_role（作为 `SUPABASE_SERVICE_ROLE_KEY`）

### 3. 创建数据库表

在 Supabase 控制台中：

1. 点击左侧菜单的 "SQL Editor"
2. 点击 "New query"
3. 粘贴以下 SQL 并执行：

```sql
-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. profiles 表 - 用户扩展信息
-- ============================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    nickname TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' NOT NULL CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================
-- 2. images 表 - 生成的图片
-- ============================================
CREATE TABLE public.images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    negative_prompt TEXT,
    image_url TEXT,
    model TEXT NOT NULL DEFAULT 'cogview-3',
    width INTEGER DEFAULT 1024,
    height INTEGER DEFAULT 1024,
    is_public BOOLEAN DEFAULT false NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'processing', 'success', 'failed')),
    error_message TEXT,
    likes_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================
-- 3. generations 表 - 生成记录
-- ============================================
CREATE TABLE public.generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    image_id UUID REFERENCES public.images(id) ON DELETE SET NULL,
    model TEXT NOT NULL,
    prompt TEXT NOT NULL,
    params JSONB,
    status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'processing', 'success', 'failed')),
    error_message TEXT,
    generation_time INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================
-- 4. likes 表 - 点赞记录
-- ============================================
CREATE TABLE public.likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    image_id UUID NOT NULL REFERENCES public.images(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE(user_id, image_id)
);

-- ============================================
-- 触发器：自动创建用户 profile
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, nickname, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 触发器绑定
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 触发器：更新 updated_at 字段
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_images_updated_at
    BEFORE UPDATE ON public.images
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- Row Level Security (RLS) 策略
-- ============================================

-- 启用 RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- profiles 策略
CREATE POLICY "用户可以查看所有公开信息" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "用户只能更新自己的信息" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- images 策略
CREATE POLICY "任何人可以查看公开图片" ON public.images
    FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "用户只能创建自己的图片" ON public.images
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户只能更新自己的图片" ON public.images
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "用户只能删除自己的图片" ON public.images
    FOR DELETE USING (auth.uid() = user_id);

-- generations 策略
CREATE POLICY "用户只能查看自己的生成记录" ON public.generations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "用户只能创建自己的生成记录" ON public.generations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- likes 策略
CREATE POLICY "任何人可以查看点赞" ON public.likes
    FOR SELECT USING (true);

CREATE POLICY "登录用户可以点赞" ON public.likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户只能取消自己的点赞" ON public.likes
    FOR DELETE USING (auth.uid() = user_id);
```

### 4. 创建存储桶

1. 点击左侧菜单的 "Storage"
2. 点击 "New bucket"
3. 输入名称：`images`
4. 选择 "Public"（公开访问）
5. 点击 "Save"

### 5. 配置认证设置

1. 点击左侧菜单的 "Authentication" > "Settings"
2. 在 "Site URL" 中输入：`http://localhost:3000`
3. 在 "Redirect URLs" 中添加：`http://localhost:3000/auth/callback`
4. 点击 "Save"

## 智谱 AI 配置

### 1. 获取 API Key

1. 访问 [智谱 AI 开放平台](https://open.bigmodel.cn/)
2. 注册并登录账号
3. 进入控制台
4. 点击 "API Key" > "创建 API Key"
5. 复制生成的 API Key 到 `.env.local` 文件中的 `ZHIPU_API_KEY`

### 2. 配置环境变量

在 `.env.local` 文件中添加：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI Models
ZHIPU_API_KEY=your_zhipu_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 项目启动

### 1. 启动开发服务器

```bash
pnpm dev
```

### 2. 访问应用

- 用户端：http://localhost:3000
- 管理端：http://localhost:3000/admin/dashboard（需要管理员账号）

### 3. 创建管理员账号

1. 注册一个普通账号
2. 在 Supabase 控制台中：
   - 进入 "Authentication" > "Users"
   - 找到你的账号，点击 "View"
   - 在 "Raw user metadata" 中添加：`{"role": "admin"}`
3. 重新登录即可获得管理员权限

## 常见问题

### 1. Supabase 连接失败

- 检查 `.env.local` 中的 URL 和 API Key 是否正确
- 确认 Supabase 项目是否已启动
- 检查网络连接

### 2. 图片生成失败

- 检查智谱 API Key 是否有效
- 确认智谱账户是否有足够余额
- 查看控制台错误信息

### 3. 权限问题

- 确认已正确设置 RLS 策略
- 检查用户是否已登录
- 管理员功能需要 `role: "admin"` 权限

### 4. 存储问题

- 确认已创建 `images` 存储桶
- 检查存储桶权限设置
- 确认 Supabase 存储配置正确

## 部署

### Vercel 部署

1. 将代码推送到 GitHub 仓库
2. 在 Vercel 中导入项目
3. 配置环境变量（与本地开发相同）
4. 部署

### 自托管

```bash
# 构建项目
pnpm build

# 启动生产服务器
pnpm start
```

## 技术支持

如遇到问题，请：

1. 查看控制台错误信息
2. 检查环境变量配置
3. 确认第三方服务状态
4. 提交 Issue 到项目仓库

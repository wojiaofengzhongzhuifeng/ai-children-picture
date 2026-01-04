// 数据库服务
import {
  IProfileRepository,
  IImageRepository,
  IGenerationRepository,
  ILikeRepository,
  SupabaseProfileRepository,
  SupabaseImageRepository,
  SupabaseGenerationRepository,
  SupabaseLikeRepository,
} from '@/lib/providers/supabase/database';

// Mock 数据库服务
import {
  MockImageRepository,
  MockGenerationRepository,
} from '@/lib/providers/mock/database';

// 存储服务
import {
  IStorageService,
  SupabaseStorageService,
} from '@/lib/providers/supabase/storage';

// 认证服务
import {
  IAuthService,
  SupabaseAuthService,
} from '@/lib/providers/supabase/auth';

// AI 服务
import { IImageGenerator, ZhipuImageGenerator } from '@/lib/providers/ai/zhipu';

import { DeepSeekImageGenerator } from '@/lib/providers/ai/deepseek';

// 检查是否使用模拟模式
const isMockMode =
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

console.log('运行模式:', isMockMode ? '模拟模式' : '生产模式');

// 数据库服务实例
export const profileRepository: IProfileRepository = isMockMode
  ? new SupabaseProfileRepository() // Mock Profile Repository not implemented yet
  : new SupabaseProfileRepository();

export const imageRepository: IImageRepository = isMockMode
  ? new MockImageRepository()
  : new SupabaseImageRepository();

export const generationRepository: IGenerationRepository = isMockMode
  ? new MockGenerationRepository()
  : new SupabaseGenerationRepository();

export const likeRepository: ILikeRepository = new SupabaseLikeRepository(); // Mock not implemented

// 存储服务实例
export const storageService: IStorageService = new SupabaseStorageService();

// 认证服务实例
export const authService: IAuthService = new SupabaseAuthService();

// AI 服务实例 - 优先使用 Zhipu，如果没有配置则回退到 DeepSeek
export const imageGenerator: IImageGenerator =
  process.env.ZHIPU_API_KEY &&
  !process.env.ZHIPU_API_KEY.includes('placeholder')
    ? new ZhipuImageGenerator(process.env.ZHIPU_API_KEY)
    : new DeepSeekImageGenerator(process.env.DEEPSEEK_API_KEY || '');

// 导出类型
export * from '@/lib/services/database';
export * from '@/lib/services/storage';
export * from '@/lib/services/auth';
export * from '@/lib/services/ai';

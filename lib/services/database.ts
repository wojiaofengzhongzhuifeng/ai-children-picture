import { Database } from '@/types/database';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Image = Database['public']['Tables']['images']['Row'];
export type Generation = Database['public']['Tables']['generations']['Row'];
export type Like = Database['public']['Tables']['likes']['Row'];

export type CreateProfileDTO = Omit<
  Database['public']['Tables']['profiles']['Insert'],
  'id' | 'created_at' | 'updated_at'
>;
export type UpdateProfileDTO = Partial<CreateProfileDTO>;

export type CreateImageDTO = Omit<
  Database['public']['Tables']['images']['Insert'],
  'id' | 'created_at' | 'updated_at'
>;
export type UpdateImageDTO = Partial<CreateImageDTO>;

export type CreateGenerationDTO = Omit<
  Database['public']['Tables']['generations']['Insert'],
  'id' | 'created_at'
>;
export type UpdateGenerationDTO = Partial<CreateGenerationDTO>;

export type CreateLikeDTO = Omit<
  Database['public']['Tables']['likes']['Insert'],
  'id' | 'created_at'
>;

// 用户信息仓库接口
export interface IProfileRepository {
  findById(id: string): Promise<Profile | null>;
  findByEmail(email: string): Promise<Profile | null>;
  create(data: CreateProfileDTO): Promise<Profile>;
  update(id: string, data: UpdateProfileDTO): Promise<Profile>;
  delete(id: string): Promise<void>;
}

// 图片仓库接口
export interface IImageRepository {
  findAll(options?: {
    isPublic?: boolean;
    userId?: string;
    limit?: number;
    offset?: number;
  }): Promise<Image[]>;
  findById(id: string): Promise<Image | null>;
  create(data: CreateImageDTO): Promise<Image>;
  update(id: string, data: UpdateImageDTO): Promise<Image>;
  delete(id: string): Promise<void>;
  count(options?: { isPublic?: boolean }): Promise<number>;
}

// 生成记录仓库接口
export interface IGenerationRepository {
  findAll(options?: {
    userId?: string;
    limit?: number;
    offset?: number;
  }): Promise<Generation[]>;
  findById(id: string): Promise<Generation | null>;
  create(data: CreateGenerationDTO): Promise<Generation>;
  update(id: string, data: UpdateGenerationDTO): Promise<Generation>;
  delete(id: string): Promise<void>;
  count(options?: { userId?: string }): Promise<number>;
}

// 点赞仓库接口
export interface ILikeRepository {
  findAll(options?: { imageId?: string; userId?: string }): Promise<Like[]>;
  findById(id: string): Promise<Like | null>;
  create(data: CreateLikeDTO): Promise<Like>;
  delete(id: string): Promise<void>;
  findByUserAndImage(userId: string, imageId: string): Promise<Like | null>;
  deleteByUserAndImage(userId: string, imageId: string): Promise<void>;
}

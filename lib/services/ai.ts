export interface ImageGenerationParams {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  model?: string;
  steps?: number;
  seed?: number;
  // CogView-4 新增参数
  quality?: 'standard' | 'hd';
  style?: 'natural' | 'artistic' | 'anime' | 'photorealistic';
}

export interface ImageGenerationResult {
  id: string;
  imageUrl: string;
  thumbnailUrl?: string;
  model: string;
  prompt: string;
  generationTime: number;
  metadata?: Record<string, any>;
}

export interface IImageGenerator {
  generate(params: ImageGenerationParams): Promise<ImageGenerationResult>;
  getModels(): Promise<string[]>;
  isAvailable(): Promise<boolean>;
}

// 文本生成接口
export interface TextGenerationParams {
  prompt: string;
  context?: string;
  maxLength?: number;
  temperature?: number;
  model?: string;
}

export interface TextGenerationResult {
  id: string;
  text: string;
  model: string;
  prompt: string;
  generationTime: number;
  metadata?: Record<string, any>;
}

export interface ITextGenerator {
  generate(params: TextGenerationParams): Promise<TextGenerationResult>;
  getModels(): Promise<string[]>;
  isAvailable(): Promise<boolean>;
}

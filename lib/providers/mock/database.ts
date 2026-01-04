import {
  IImageRepository,
  IGenerationRepository,
  ImageGenerationCreateParams,
  GenerationCreateParams,
  GenerationUpdateParams,
  Image,
} from '@/lib/services/database';

export class MockImageRepository implements IImageRepository {
  private images: Image[] = [];
  private nextId = 1;

  async create(params: ImageGenerationCreateParams): Promise<Image> {
    const image: Image = {
      id: `mock_image_${this.nextId++}`,
      user_id: params.user_id,
      prompt: params.prompt,
      negative_prompt: params.negative_prompt,
      image_url: params.image_url,
      thumbnail_url: params.thumbnail_url,
      model: params.model,
      width: params.width,
      height: params.height,
      is_public: params.is_public,
      status: params.status || 'success',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.images.push(image);
    return image;
  }

  async findById(id: string): Promise<Image | null> {
    return this.images.find((img) => img.id === id) || null;
  }

  async findByUserId(userId: string, limit?: number): Promise<Image[]> {
    const userImages = this.images.filter((img) => img.user_id === userId);
    return limit ? userImages.slice(0, limit) : userImages;
  }

  async findPublic(limit?: number): Promise<Image[]> {
    const publicImages = this.images.filter((img) => img.is_public);
    return limit ? publicImages.slice(0, limit) : publicImages;
  }

  async update(id: string, updates: Partial<Image>): Promise<Image> {
    const index = this.images.findIndex((img) => img.id === id);
    if (index === -1) {
      throw new Error('Image not found');
    }

    this.images[index] = {
      ...this.images[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    return this.images[index];
  }

  async delete(id: string): Promise<void> {
    const index = this.images.findIndex((img) => img.id === id);
    if (index !== -1) {
      this.images.splice(index, 1);
    }
  }

  async updateStatus(id: string, status: string): Promise<Image> {
    return this.update(id, { status });
  }
}

export class MockGenerationRepository implements IGenerationRepository {
  private generations: any[] = [];
  private nextId = 1;

  async create(params: GenerationCreateParams): Promise<any> {
    const generation = {
      id: `mock_gen_${this.nextId++}`,
      user_id: params.user_id,
      model: params.model,
      prompt: params.prompt,
      params: params.params,
      status: params.status || 'processing',
      image_id: null,
      generation_time: null,
      error_message: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.generations.push(generation);
    return generation;
  }

  async findById(id: string): Promise<any> {
    return this.generations.find((gen) => gen.id === id) || null;
  }

  async findByUserId(userId: string, limit?: number): Promise<any[]> {
    const userGenerations = this.generations.filter(
      (gen) => gen.user_id === userId
    );
    return limit ? userGenerations.slice(0, limit) : userGenerations;
  }

  async update(id: string, updates: GenerationUpdateParams): Promise<any> {
    const index = this.generations.findIndex((gen) => gen.id === id);
    if (index === -1) {
      throw new Error('Generation not found');
    }

    this.generations[index] = {
      ...this.generations[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    return this.generations[index];
  }

  async delete(id: string): Promise<void> {
    const index = this.generations.findIndex((gen) => gen.id === id);
    if (index !== -1) {
      this.generations.splice(index, 1);
    }
  }

  async updateStatus(id: string, status: string): Promise<any> {
    return this.update(id, { status });
  }
}

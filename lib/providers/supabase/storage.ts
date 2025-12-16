import { supabase } from '@/lib/supabase/client'
import { IStorageService } from '@/lib/services/storage'

export class SupabaseStorageService implements IStorageService {
  private bucketName = 'images'

  async upload(file: File, path: string): Promise<{ url: string; path: string }> {
    const { data, error } = await supabase.storage
      .from(this.bucketName)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(path)

    return {
      url: publicUrl,
      path: data.path
    }
  }

  async delete(path: string): Promise<void> {
    const { error } = await supabase.storage
      .from(this.bucketName)
      .remove([path])

    if (error) throw error
  }

  getPublicUrl(path: string): string {
    const { data: { publicUrl } } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(path)

    return publicUrl
  }

  async generateThumbnail(path: string, options?: { width?: number; height?: number }): Promise<string> {
    const width = options?.width || 300
    const height = options?.height || 300

    const { data } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(path, {
        transform: {
          width,
          height
        }
      })

    return data.publicUrl
  }
}

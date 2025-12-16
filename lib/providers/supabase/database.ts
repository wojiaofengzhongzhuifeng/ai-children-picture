import { supabase } from '@/lib/supabase/client'
import {
  IProfileRepository,
  IImageRepository,
  IGenerationRepository,
  ILikeRepository,
  Profile,
  Image,
  Generation,
  Like,
  CreateProfileDTO,
  UpdateProfileDTO,
  CreateImageDTO,
  UpdateImageDTO,
  CreateGenerationDTO,
  UpdateGenerationDTO,
  CreateLikeDTO
} from '@/lib/services/database'

export class SupabaseProfileRepository implements IProfileRepository {
  async findById(id: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  async findByEmail(email: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error) throw error
    return data
  }

  async create(data: CreateProfileDTO): Promise<Profile> {
    const { data: result, error } = await supabase
      .from('profiles')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  async update(id: string, data: UpdateProfileDTO): Promise<Profile> {
    const { data: result, error } = await supabase
      .from('profiles')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

export class SupabaseImageRepository implements IImageRepository {
  async findAll(options?: { 
    isPublic?: boolean
    userId?: string
    limit?: number
    offset?: number
  }): Promise<Image[]> {
    let query = supabase
      .from('images')
      .select('*')
    
    if (options?.isPublic !== undefined) {
      query = query.eq('is_public', options.isPublic)
    }
    
    if (options?.userId) {
      query = query.eq('user_id', options.userId)
    }
    
    if (options?.limit) {
      query = query.limit(options.limit)
    }
    
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }
    
    query = query.order('created_at', { ascending: false })
    
    const { data, error } = await query
    
    if (error) throw error
    return data || []
  }

  async findById(id: string): Promise<Image | null> {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  async create(data: CreateImageDTO): Promise<Image> {
    const { data: result, error } = await supabase
      .from('images')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  async update(id: string, data: UpdateImageDTO): Promise<Image> {
    const { data: result, error } = await supabase
      .from('images')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('images')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  async count(options?: { isPublic?: boolean }): Promise<number> {
    let query = supabase
      .from('images')
      .select('*', { count: 'exact', head: true })
    
    if (options?.isPublic !== undefined) {
      query = query.eq('is_public', options.isPublic)
    }
    
    const { count, error } = await query
    
    if (error) throw error
    return count || 0
  }
}

export class SupabaseGenerationRepository implements IGenerationRepository {
  async findAll(options?: { 
    userId?: string
    limit?: number
    offset?: number
  }): Promise<Generation[]> {
    let query = supabase
      .from('generations')
      .select('*')
    
    if (options?.userId) {
      query = query.eq('user_id', options.userId)
    }
    
    if (options?.limit) {
      query = query.limit(options.limit)
    }
    
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }
    
    query = query.order('created_at', { ascending: false })
    
    const { data, error } = await query
    
    if (error) throw error
    return data || []
  }

  async findById(id: string): Promise<Generation | null> {
    const { data, error } = await supabase
      .from('generations')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  async create(data: CreateGenerationDTO): Promise<Generation> {
    const { data: result, error } = await supabase
      .from('generations')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  async update(id: string, data: UpdateGenerationDTO): Promise<Generation> {
    const { data: result, error } = await supabase
      .from('generations')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('generations')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  async count(options?: { userId?: string }): Promise<number> {
    let query = supabase
      .from('generations')
      .select('*', { count: 'exact', head: true })
    
    if (options?.userId) {
      query = query.eq('user_id', options.userId)
    }
    
    const { count, error } = await query
    
    if (error) throw error
    return count || 0
  }
}

export class SupabaseLikeRepository implements ILikeRepository {
  async findAll(options?: { 
    imageId?: string
    userId?: string
  }): Promise<Like[]> {
    let query = supabase
      .from('likes')
      .select('*')
    
    if (options?.imageId) {
      query = query.eq('image_id', options.imageId)
    }
    
    if (options?.userId) {
      query = query.eq('user_id', options.userId)
    }
    
    query = query.order('created_at', { ascending: false })
    
    const { data, error } = await query
    
    if (error) throw error
    return data || []
  }

  async findById(id: string): Promise<Like | null> {
    const { data, error } = await supabase
      .from('likes')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  async create(data: CreateLikeDTO): Promise<Like> {
    const { data: result, error } = await supabase
      .from('likes')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  async findByUserAndImage(userId: string, imageId: string): Promise<Like | null> {
    const { data, error } = await supabase
      .from('likes')
      .select('*')
      .eq('user_id', userId)
      .eq('image_id', imageId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data || null
  }

  async deleteByUserAndImage(userId: string, imageId: string): Promise<void> {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', userId)
      .eq('image_id', imageId)
    
    if (error) throw error
  }
}

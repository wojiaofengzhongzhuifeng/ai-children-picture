export interface IStorageService {
  upload(file: File, path: string): Promise<{ url: string; path: string }>
  delete(path: string): Promise<void>
  getPublicUrl(path: string): string
  generateThumbnail(path: string, options?: { width?: number; height?: number }): Promise<string>
}

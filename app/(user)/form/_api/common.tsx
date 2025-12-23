export const prefixUrl = '/api'

export type ApiConfig = {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  manual: boolean
  showError: boolean
}

/**
 * 统一获取前端请求需要携带的鉴权头：
 * - 登录/注册成功后后端会返回 { user, token, token_type: "bearer", expires_in }
 * - 前端在 login/register 成功时把 data.token 存到 localStorage.authToken
 * - 这里在有 token 时自动拼出 Authorization: Bearer <token>
 *
 * 后端只需要在受保护接口中依赖 token 里的 user_id（例如 GET /api/me），
 * 就可以校验当前用户身份并做“只操作自己的数据”的逻辑。
 */
export const getAuthHeaders = ():
  | {
      Authorization: string
    }
  | undefined => {
  if (typeof window === 'undefined') return undefined
  const token = window.localStorage.getItem('authToken')
  if (!token) return undefined
  return {
    Authorization: `Bearer ${token}`,
  }
}

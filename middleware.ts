import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let res = NextResponse.next()

  // 临时移除 Supabase 初始化以避免无效 URL 错误
  // 如果需要恢复认证功能，请配置正确的 Supabase URL
  let session = null

  // 只有在 Supabase URL 配置正确时才初始化客户端
  if (process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name) {
              return req.cookies.get(name)?.value
            },
            set(name, value, options) {
              req.cookies.set(name, value)
              res = NextResponse.next({
                request: {
                  headers: req.headers,
                },
              })
              res.cookies.set({
                name,
                value,
                ...options,
              })
            },
            remove(name, options) {
              req.cookies.set(name, '')
              res = NextResponse.next({
                request: {
                  headers: req.headers,
                },
              })
              res.cookies.set({
                name,
                value: '',
                ...options,
              })
            },
          },
        }
      )

      const result = await supabase.auth.getSession()
      session = result.data.session
    } catch (error) {
      console.warn('Supabase initialization failed:', error)
      session = null
    }
  }

  // 临时移除登录限制，允许所有用户访问
  // 如果需要恢复登录限制，请取消下面的注释

  // 如果用户未登录且访问受保护的路由，重定向到登录页
  // if (!session && req.nextUrl.pathname.startsWith('/my')) {
  //   const redirectUrl = new URL('/auth/login', req.url)
  //   redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
  //   return NextResponse.redirect(redirectUrl)
  // }

  // 如果用户未登录且访问管理端，重定向到登录页
  // if (!session && req.nextUrl.pathname.startsWith('/admin')) {
  //   const redirectUrl = new URL('/auth/login', req.url)
  //   redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
  //   return NextResponse.redirect(redirectUrl)
  // }

  // 如果用户已登录且访问认证页面，重定向到首页
  // if (session && req.nextUrl.pathname.startsWith('/auth')) {
  //   return NextResponse.redirect(new URL('/', req.url))
  // }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

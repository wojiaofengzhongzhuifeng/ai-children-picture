'use client'

import { ReactNode, useState, useEffect } from 'react'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { ConfigProvider, Layout, Menu, theme, Avatar, Dropdown, Button } from 'antd'
import { 
  DashboardOutlined, 
  UserOutlined, 
  PictureOutlined, 
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { authService } from '@/lib'

const { Header, Sider, Content } = Layout

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser()
        
        // 检查用户是否为管理员
        if (currentUser?.user_metadata?.role !== 'admin') {
          router.push('/')
          return
        }
        
        setUser(currentUser)
      } catch (error) {
        console.error('Failed to fetch user:', error)
        router.push('/')
      }
    }

    fetchUser()

    const { data: { subscription } } = authService.onAuthStateChange(
      (event, session) => {
        if (session?.user?.user_metadata?.role !== 'admin') {
          router.push('/')
          return
        }
        setUser(session?.user || null)
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  const handleSignOut = async () => {
    try {
      await authService.signOut()
      router.push('/')
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: <Link href="/admin/dashboard">仪表盘</Link>,
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: <Link href="/admin/users">用户管理</Link>,
    },
    {
      key: '/admin/images',
      icon: <PictureOutlined />,
      label: <Link href="/admin/images">图片管理</Link>,
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: <Link href="/admin/settings">系统设置</Link>,
    },
  ]

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleSignOut,
    },
  ]

  if (!user) {
    return null
  }

  return (
    <AntdRegistry>
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
        }}
      >
        <Layout style={{ minHeight: '100vh' }}>
          <Sider 
            trigger={null} 
            collapsible 
            collapsed={collapsed}
            style={{
              position: 'fixed',
              height: '100vh',
              left: 0,
              top: 0,
              bottom: 0,
            }}
          >
            <div className="demo-logo-vertical h-16 m-4 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-lg">
              {collapsed ? 'A' : 'Admin'}
            </div>
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[pathname]}
              items={menuItems}
            />
          </Sider>
          <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
            <Header style={{ padding: 0, background: '#fff' }} className="flex items-center justify-between px-4">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: '16px',
                  width: 64,
                  height: 64,
                }}
              />
              <Dropdown
                menu={{
                  items: userMenuItems,
                }}
                placement="bottomRight"
              >
                <div className="flex items-center gap-2 cursor-pointer px-4 py-2 hover:bg-gray-100 rounded">
                  <Avatar src={user.user_metadata?.avatar_url} icon={<UserOutlined />} />
                  <span>{user.user_metadata?.nickname || user.email}</span>
                </div>
              </Dropdown>
            </Header>
            <Content
              style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280,
                background: '#fff',
                borderRadius: '8px',
              }}
            >
              {children}
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    </AntdRegistry>
  )
}

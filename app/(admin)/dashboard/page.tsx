'use client'

import { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Table, Tag } from 'antd'
import { UserOutlined, PictureOutlined, BarChartOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { Profile, Image, Generation } from '@/lib'
import { profileRepository, imageRepository, generationRepository } from '@/lib'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalImages: 0,
    totalGenerations: 0,
    todayGenerations: 0
  })
  const [recentImages, setRecentImages] = useState<Image[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 获取统计数据
        const [allProfiles, allImages, allGenerations] = await Promise.all([
          profileRepository.findAll(),
          imageRepository.findAll(),
          generationRepository.findAll()
        ])

        // 计算今日生成数
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const todayGenerations = allGenerations.filter(
          gen => new Date(gen.created_at) >= today
        ).length

        setStats({
          totalUsers: allProfiles.length,
          totalImages: allImages.length,
          totalGenerations: allGenerations.length,
          todayGenerations
        })

        // 获取最近的图片
        const recent = await imageRepository.findAll({ limit: 10 })
        setRecentImages(recent)
      } catch (error) {
        console.error('获取仪表盘数据失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const imageColumns = [
    {
      title: '预览',
      dataIndex: 'image_url',
      key: 'image_url',
      render: (url: string) => (
        <img 
          src={url} 
          alt="预览" 
          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} 
        />
      ),
    },
    {
      title: '描述',
      dataIndex: 'prompt',
      key: 'prompt',
      ellipsis: true,
    },
    {
      title: '模型',
      dataIndex: 'model',
      key: 'model',
      render: (model: string) => (
        <Tag color="blue">{model}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default'
        let text = '未知'
        
        switch (status) {
          case 'success':
            color = 'success'
            text = '成功'
            break
          case 'failed':
            color = 'error'
            text = '失败'
            break
          case 'processing':
            color = 'processing'
            text = '处理中'
            break
          case 'pending':
            color = 'warning'
            text = '等待中'
            break
        }
        
        return <Tag color={color}>{text}</Tag>
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleString(),
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">仪表盘</h1>
      
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总图片数"
              value={stats.totalImages}
              prefix={<PictureOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总生成次数"
              value={stats.totalGenerations}
              prefix={<BarChartOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日生成"
              value={stats.todayGenerations}
              prefix={<ClockCircleOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Card title="最近生成的图片">
        <Table
          columns={imageColumns}
          dataSource={recentImages}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
      </Card>
    </div>
  )
}

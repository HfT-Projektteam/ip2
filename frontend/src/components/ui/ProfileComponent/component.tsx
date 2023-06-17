import Feed from '@pages/Feed'
import { Avatar, Col, Divider, Row, Space, Typography } from 'antd'
import { useState } from 'react'
import mockData from '@data/mockdata/feed.json'
import { type feedInterface } from '@pages/Feed/interface'

const { Text } = Typography

export function ProfileComponent(): JSX.Element {
  const [numPosts] = useState<number>(0)
  const [numFollowers] = useState<number>(0)
  const [numFollowings] = useState<number>(0)
  const [feed] = useState<feedInterface>(mockData)
  const [url] = useState<string>(
    'https://ionicframework.com/docs/img/demos/avatar.svg',
  )

  return (
    <>
      <Space direction='vertical' size='middle' style={{ display: 'flex' }}>
        <Row justify='space-around' align='middle'>
          <Col flex={2}>
            <Avatar
              size={{ xs: 100, sm: 100, md: 100, lg: 120, xl: 120, xxl: 120 }}
              src={<img src={url} alt='avatar' />}
            />
          </Col>
          <Col flex={3}>
            <Row>
              <Col span={8}>
                <Text strong>
                  {numPosts} <br /> Posts
                </Text>
              </Col>
              <Col span={8}>
                <Text strong>
                  {' '}
                  {numFollowers} <br /> Followers{' '}
                </Text>
              </Col>
              <Col span={8}>
                <Text strong>
                  {numFollowings} <br /> Following{' '}
                </Text>
              </Col>
            </Row>
          </Col>
        </Row>
      </Space>
      <Divider />
      <Feed {...feed}></Feed>
    </>
  )
}

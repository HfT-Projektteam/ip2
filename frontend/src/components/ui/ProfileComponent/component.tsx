import Feed from '@pages/Feed'
import { Avatar, Col, Divider, Popover, Row, Space, Typography } from 'antd'
import { useEffect, useState } from 'react'
import mockDataFeed from '@data/mockdata/feed.json'
import { type feedInterface } from '@pages/Feed/interface'
import Follower from '@Components/ui/Follower'
import { getFollowersNum, getFollowingsNum } from '@services/BackendAPI'

const { Text } = Typography

export function ProfileComponent(): JSX.Element {
  const [numPosts] = useState<number>(0)
  const [numFollowers, setNumFollowers] = useState<number>(0)
  const [numFollowings, setNumFollowings] = useState<number>(0)
  const [feed] = useState<feedInterface>(mockDataFeed)
  const [url] = useState<string>(
    'https://ionicframework.com/docs/img/demos/avatar.svg',
  )

  useEffect(() => {
    getFollowersNum()
      .then((num) => {
        setNumFollowers(num ?? 0)
      })
      .catch((err) => {
        console.error(err)
      })

    getFollowingsNum()
      .then((num) => {
        setNumFollowings(num ?? 0)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])

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
                  {numFollowers} <br />
                  <Popover
                    placement='bottom'
                    content={<Follower type='follower' />}
                    title='Follower'
                    trigger='click'
                  >
                    Follower
                  </Popover>
                </Text>
              </Col>
              <Col span={8}>
                <Text strong>
                  {numFollowings} <br />
                  <Popover
                    placement='bottom'
                    content={<Follower type='followings' />}
                    title='Following'
                    trigger='click'
                  >
                    Following
                  </Popover>
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

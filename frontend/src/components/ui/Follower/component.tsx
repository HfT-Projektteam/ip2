import { List } from 'antd'
import { useEffect, useState } from 'react'
import { type components as BackendComponents } from '@data/openapi'
import { getFollower } from '@services/BackendAPI/component'
type FollowerType = BackendComponents['schemas']['User']

export function Follower(): JSX.Element {
  const [follower, setFollower] = useState<FollowerType[]>([])

  useEffect(() => {
    getFollower('')
      .then((follower) => {
        setFollower(follower ?? [])
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])

  const onUserClick = (follower: FollowerType): void => {
    alert(`open user: + ${follower.firstName}`)
  }

  return (
    <>
      <List
        key='follower.list'
        itemLayout='horizontal'
        dataSource={follower}
        renderItem={(follower, index) => (
          <List.Item
            onClick={() => {
              onUserClick(follower)
            }}
          >
            <List.Item.Meta
              title={`${follower.firstName} ${follower.lastName}`}
            />
          </List.Item>
        )}
      />
    </>
  )
}

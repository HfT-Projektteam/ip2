import { Avatar, List } from 'antd'
import { useEffect, useState } from 'react'
import { getUser } from '@services/SpotifyAPI'
import { type components as BackendComponents } from '@data/openapi'
import { type components as SpotifyComponents } from '@data/spotify-types'
type FollowerType = BackendComponents['schemas']['UserDto']
type User = SpotifyComponents['schemas']['PublicUserObject']

export function Follower(props: FollowerType[]): JSX.Element {
  const [users, setUsers] = useState<User[]>([])
  let ranonce = false

  useEffect(() => {
    // dirty solution to prevent issues from useEffect triggered twice
    if (ranonce) return
    ranonce = true

    Object.values(props).forEach((follower) => {
      getUser(follower.spotify_uri)
        .then((user) => {
          if (user === null) return
          setUsers((users) => [...users, user])
        })
        .catch((err) => {
          console.error(err)
        })
    })
  }, [])

  const onUserClick = (user: User): void => {
    if (user.display_name === undefined || user.display_name === null) return
    alert(`open user: + ${user.display_name}`)
  }

  return (
    <>
      <List
        key='follower.list'
        itemLayout='horizontal'
        dataSource={users}
        renderItem={(user, index) => (
          <List.Item
            onClick={() => {
              onUserClick(user)
            }}
          >
            <List.Item.Meta
              avatar={<Avatar src={user?.images?.at(0)?.url} />}
              title={`${user?.display_name ?? 'No name'}`}
            />
          </List.Item>
        )}
      />
    </>
  )
}

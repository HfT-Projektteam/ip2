import { Avatar, List } from 'antd'
import { useEffect, useState } from 'react'
import { type components as BackendComponents } from '@data/openapi'
import { type components as SpotifyComponents } from '@data/spotify-types'
import { getFollowers } from '@services/BackendAPI/component'
import { getUser } from '@services/SpotifyAPI'
import mockData from '@data/mockdata/user.json'
type FollowerType = BackendComponents['schemas']['UserDto']
type User = SpotifyComponents['schemas']['PublicUserObject']

export function Follower(): JSX.Element {
  const [follower, setFollower] = useState<FollowerType[]>([])
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    getFollowers('')
      .then((follower) => {
        // todo: remove mockData
        setFollower(follower ?? mockData.users)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])

  useEffect(() => {
    follower.forEach((follower) => {
      getUser(follower.spotify_uri)
        .then((user) => {
          if (user === null) return
          setUsers((users) => [...users, user])
        })
        .catch((err) => {
          console.error(err)
        })
    })
  }, [follower])

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

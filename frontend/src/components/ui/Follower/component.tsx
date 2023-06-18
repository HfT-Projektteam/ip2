import { Avatar, List, Skeleton } from 'antd'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useEffect, useState } from 'react'
import { getUser } from '@services/SpotifyAPI'
import { type components as BackendComponents } from '@data/openapi'
import { type components as SpotifyComponents } from '@data/spotify-types'
import { getFollowers, getFollowings } from '@services/BackendAPI'
import { type followerInterface } from './interface'
type FollowerType = BackendComponents['schemas']['UserDto']
type User = SpotifyComponents['schemas']['PublicUserObject']

export function Follower(props: followerInterface): JSX.Element {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [followers, setFollowers] = useState<FollowerType[]>([])
  const [followings, setFollowings] = useState<FollowerType[]>([])
  const [followersPage, setFollowersPage] = useState(0)
  const [followingsPage, setFollowingsPage] = useState(0)
  let ranOnce = false

  useEffect(() => {
    // dirty solution to prevent issues from useEffect triggered twice
    if (ranOnce) return
    ranOnce = true
    loadMoreData()
  }, [])

  useEffect(() => {
    followings.forEach((follower) => {
      getUser(follower.spotify_uri)
        .then((user) => {
          if (user === null) return
          setUsers((users) => [...users, user])
        })
        .catch((err) => {
          console.error(err)
        })
    })
  }, [followings])

  useEffect(() => {
    followers.forEach((follower) => {
      getUser(follower.spotify_uri)
        .then((user) => {
          if (user === null) return
          setUsers((users) => [...users, user])
        })
        .catch((err) => {
          console.error(err)
        })
    })
  }, [followers])

  const loadMoreData = (): void => {
    if (loading) {
      return
    }
    setLoading(true)

    if (props.type === 'following')
      getFollowings(followingsPage)
        .then((follower) => {
          setFollowings(follower ?? [])
          setFollowingsPage(followingsPage + 1)
          setLoading(false)
        })
        .catch((err) => {
          console.error(err)
          setLoading(false)
        })

    if (props.type === 'follower')
      getFollowers(followersPage)
        .then((follower) => {
          setFollowers(follower ?? [])
          setFollowersPage(followersPage + 1)
          setLoading(false)
        })
        .catch((err) => {
          console.error(err)
          setLoading(false)
        })
  }

  const onUserClick = (user: User): void => {
    if (user.display_name === undefined || user.display_name === null) return
    alert(`open user: + ${user.display_name}`)
  }

  return (
    <>
      <InfiniteScroll
        dataLength={users.length}
        next={loadMoreData}
        hasMore={users.length < 0}
        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
        // endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget='scrollableDiv'
      >
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
      </InfiniteScroll>
    </>
  )
}

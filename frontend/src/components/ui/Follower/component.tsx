import { Avatar, List, Skeleton } from 'antd'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useEffect, useState } from 'react'
import { getUser } from '@services/SpotifyAPI'
import { type components as BackendComponents } from '@data/openapi'
import { type components as SpotifyComponents } from '@data/spotify-types'
import { getFollowers } from '@services/BackendAPI'
import { type followerInterface } from './interface'
type FollowerType = BackendComponents['schemas']['UserDto']
type User = SpotifyComponents['schemas']['PublicUserObject']

export function Follower(props: followerInterface): JSX.Element {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [followers, setFollowers] = useState<FollowerType[]>([])
  const [followersPage, setFollowersPage] = useState(0)
  let ranOnce = false

  useEffect(() => {
    if (ranOnce) return
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ranOnce = true

    setUsers([]) // Clear existing user data
    setFollowers([]) // Clear existing follower data
    setFollowersPage(0) // Reset the page counter
    setLoading(false) // Reset the loading state
    loadMoreData(true)
  }, [props.spotify_id, props.type])

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

  const loadMoreData = (initialPage: boolean): void => {
    if (loading) {
      return
    }
    setLoading(true)

    getFollowers(props.spotify_id, props.type, initialPage ? 0 : followersPage)
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
    if (user.id == null) return
    props.setSpotifyId(user.id)
  }

  return (
    <>
      <InfiniteScroll
        dataLength={users.length}
        next={() => {
          loadMoreData(false)
        }}
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

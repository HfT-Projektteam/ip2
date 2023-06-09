import { Avatar, Button, Input, List, Space, theme } from 'antd'
import { type components as BackendComponents } from '@data/openapi'
import { type components as SpotifyComponents } from '@data/spotify-types'
import { searchUsers, setFollower } from '@services/BackendAPI'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getUser } from '@services/SpotifyAPI'
import useWindowDimensions from '@hooks/useWindowDimensions'
type UserBackend = BackendComponents['schemas']['UserDto']
type UserSpotify = SpotifyComponents['schemas']['PublicUserObject']

const { useToken } = theme
const { Search } = Input

export function SearchPage(): JSX.Element {
  const currentUserId = localStorage.getItem('spotifyId')
  const [usersBackend, setUsersBackend] = useState<UserBackend[]>([])
  const [userSpotify, setUserSpotify] = useState<UserSpotify[]>([])
  const [searchInput, setSearchInput] = useState<string>('')
  const [usersPage, setUsersPage] = useState<number>(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    usersBackend.forEach((user) => {
      getUser(user.spotify_uri)
        .then((user) => {
          if (user === null) return
          setUserSpotify((users) => [...users, user])
        })
        .catch((err) => {
          console.error(err)
        })
    })
  }, [usersBackend])

  useEffect(() => {
    if (usersPage === 0) return
    searchUsers(searchInput, usersPage)
      .then((user) => {
        if (user == null) return
        setUsersBackend(user)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [usersPage])

  const onSearch = async (value: string): Promise<void> => {
    setUserSpotify([])
    setSearchInput(value)
    setUsersPage(0)
    searchUsers(value, 0)
      .then((user) => {
        if (user == null) return
        setUsersBackend(user)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }

  const loadMoreData = (): void => {
    if (loading || searchInput === '') {
      return
    }
    setLoading(true)
    setUsersPage(usersPage + 1)
  }

  const onFollowClick = async (user: UserSpotify): Promise<void> => {
    if (user.id == null) return
    if (currentUserId == null || currentUserId === '') return
    await setFollower(currentUserId, user.id)
  }

  const { width } = useWindowDimensions()
  const [containerWidth, setContainerWidth] = useState('100%')

  useEffect(() => {
    width <= 768 ? setContainerWidth('100%') : setContainerWidth('500px')
  }, [width])

  const { token } = useToken()

  return (
    <>
      <span
        style={{
          position: 'fixed',
          width: `${containerWidth}`,
          background: `${token.colorBgLayout}`,
          height: '42px',
          zIndex: 2,
          marginBottom: '10px',
        }}
      ></span>
      <Space
        direction='vertical'
        style={{
          position: 'fixed',
          width: `${containerWidth}`,
          padding: '10px',
          zIndex: 2,
        }}
      >
        <Search
          placeholder='Search User'
          onSearch={(value) => {
            void onSearch(value)
          }}
        />
      </Space>

      <InfiniteScroll
        dataLength={userSpotify.length}
        next={() => {
          loadMoreData()
        }}
        hasMore={userSpotify.length < 50}
        loader={<></>}
        // endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget='scrollableDiv'
      >
        <List
          style={{
            padding: '32px 10px 0px 10px',
            minHeight: '80vh',
          }}
          key='follower.list'
          itemLayout='horizontal'
          dataSource={userSpotify}
          locale={{ emptyText: ' ' }}
          renderItem={(user, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={user?.images?.at(0)?.url} />}
                title={`${user?.display_name ?? 'No name'}`}
              />
              <Button
                type='primary'
                onClick={() => {
                  void onFollowClick(user)
                }}
              >
                Follow
              </Button>
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </>
  )
}

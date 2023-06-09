// import { useEffect, useState } from 'react'

import { Post } from '@pages/Feed/Post'
import { type HandleFeedChange, type feedInterface } from './interface'
import { useEffect, useState } from 'react'
import {
  getPosts,
  getPostsById,
  getPrivatePosts,
} from '@services/BackendAPI/component'
import { Button, List } from 'antd'
import InfiniteScroll from 'react-infinite-scroll-component'
import ScrollToTop from '@services/ScrollToTop'
import { GlobalOutlined, UsergroupAddOutlined } from '@ant-design/icons'

interface FeedProps {
  feed: feedInterface
  handleFeedChange: HandleFeedChange['handleFeedChange']
  sort: string
  genre: string
}

export function Feed({
  feed,
  handleFeedChange,
  sort,
  genre,
}: FeedProps): JSX.Element {
  const [isPrivateFeed, setIsPrivateFeed] = useState(true)
  const [pagination, setPagination] = useState<number>()
  const [loading, setLoading] = useState(false)
  const [sortGenreChanged, setSortGenreChanged] = useState<boolean>(false)

  const switchFeed = (): void => {
    setPagination(0)
    handleFeedChange({ posts: [] })
    setIsPrivateFeed(!isPrivateFeed)
  }

  useEffect(() => {
    setPagination(0)
    return (): void => {
      handleFeedChange({ posts: [] })
    }
  }, [])

  useEffect(() => {
    // ONLY FOR GLOBAL FEED
    if (isPrivateFeed) return
    void (async () => {
      const allPosts = await getPosts(genre, isPrivateFeed, sort, pagination)
      if (allPosts === null) {
        return
      }

      const newFeed = feed.posts.concat(allPosts)

      handleFeedChange({ posts: newFeed })
      setLoading(false)
    })()
  }, [sortGenreChanged, pagination, isPrivateFeed])

  useEffect(() => {
    // ONLY FOR PRIVATE FEED
    if (!isPrivateFeed) return
    void (async () => {
      const allPosts = await getPrivatePosts(
        genre,
        isPrivateFeed,
        sort,
        pagination,
      )
      if (allPosts === null) {
        return
      }

      const newFeed = feed.posts.concat(allPosts)

      handleFeedChange({ posts: newFeed })
      setLoading(false)
    })()
  }, [sortGenreChanged, pagination, isPrivateFeed])

  useEffect(() => {
    setPagination(0)
    handleFeedChange({ posts: [] })
    setSortGenreChanged(!sortGenreChanged)
  }, [sort, genre])

  const loadMoreData = (): void => {
    if (loading) return
    setPagination(pagination === undefined ? 0 : pagination + 1)
    setLoading(true)
  }
  return (
    <>
      {pagination === 0 ? <ScrollToTop /> : <></>}
      <Button
        type='default'
        icon={
          isPrivateFeed ? (
            <UsergroupAddOutlined rev={'private'} />
          ) : (
            <GlobalOutlined rev={'global'} />
          )
        }
        block
        onClick={switchFeed}
      >
        Switch Feed
      </Button>
      <InfiniteScroll
        dataLength={feed.posts.length}
        next={() => {
          loadMoreData()
        }}
        hasMore={true}
        loader={<></>}
        scrollableTarget='scrollableDiv'
      >
        <List
          style={{
            minHeight: '80vh',
          }}
          key='feed.list'
          itemLayout='horizontal'
          dataSource={feed.posts}
          locale={{ emptyText: ' ' }}
          renderItem={(post) => (
            <List.Item>
              <Post key={post.uuid} isFeed={true} postObject={post} />
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </>
  )
}

export function ProfileFeed(props: { spotifyId: string }): JSX.Element {
  const [profileFeed, setProfileFeed] = useState<feedInterface>({ posts: [] })

  useEffect(() => {
    void (async () => {
      const allPosts = await getPostsById(props.spotifyId)
      if (allPosts == null) return
      setProfileFeed({ posts: allPosts })
    })()
  }, [props.spotifyId])
  return (
    <>
      {profileFeed.posts.map((post) => (
        <Post key={post.uuid} isFeed={false} postObject={post}></Post>
      ))}
    </>
  )
}

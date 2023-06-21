// import { useEffect, useState } from 'react'

import { Post } from '@pages/Feed/Post'
import { type HandleFeedChange, type feedInterface } from './interface'
import { useEffect, useState } from 'react'
import { getPosts } from '@services/BackendAPI/component'
import { Button, List } from 'antd'
import InfiniteScroll from 'react-infinite-scroll-component'

interface FeedProps {
  feed: feedInterface
  handleFeedChange: HandleFeedChange['handleFeedChange']
}

export function Feed({ feed, handleFeedChange }: FeedProps): JSX.Element {
  const [isPrivateFeed, setIsPrivateFeed] = useState(true)
  const [pagination, setPagination] = useState(0)
  const [loading, setLoading] = useState(false)

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
    void (async () => {
      const allPosts = await getPosts('', isPrivateFeed, undefined, pagination)
      if (allPosts === null) return

      const newPosts = allPosts?.map((post) => {
        return { id: post.uuid, spotifyId: post.songId }
      })

      const newFeed = feed.posts.concat(newPosts)

      handleFeedChange({ posts: newFeed })
      setLoading(false)
    })()
  }, [pagination, isPrivateFeed])

  const loadMoreData = (): void => {
    if (loading) return
    setPagination(pagination === undefined ? 0 : pagination + 1)
    setLoading(true)
  }
  return (
    <>
      {feed.posts.length}
      <Button onClick={switchFeed}>Switch Feed (Global/Private)</Button>

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
            padding: '32px 10px 0px 10px',
            minHeight: '80vh',
          }}
          key='feed.list'
          itemLayout='horizontal'
          dataSource={feed.posts}
          locale={{ emptyText: ' ' }}
          renderItem={(post) => (
            <List.Item>
              <Post key={post.id} {...post} />
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </>
  )
}

export function ProfileFeed(feed: feedInterface): JSX.Element {
  return (
    <>
      {feed.posts.map((post) => (
        <Post key={post.id} {...post}></Post>
      ))}
    </>
  )
}

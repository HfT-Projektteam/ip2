// import { useEffect, useState } from 'react'

import { Post } from '@pages/Feed/Post'
import { type HandleFeedChange, type feedInterface } from './interface'
import { useEffect, useState } from 'react'
import { getPosts, getUserPosts } from '@services/BackendAPI/component'
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

      const newFeed = feed.posts.concat(allPosts)

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

export function ProfileFeed(feed: feedInterface): JSX.Element {
  const [profileFeed, setProfileFeed] = useState<feedInterface>({ posts: [] })

  useEffect(() => {
    void (async () => {
      const allPosts = await getUserPosts()
      if (allPosts == null) return
      setProfileFeed({ posts: allPosts })
    })()
  }, [])
  return (
    <>
      {profileFeed.posts.map((post) => (
        <Post key={post.uuid} isFeed={false} postObject={post}></Post>
      ))}
    </>
  )
}

// import { useEffect, useState } from 'react'

import { Post } from '@pages/Feed/Post'
import { type HandleFeedChange, type feedInterface } from './interface'
import { useEffect, useState } from 'react'
import { getPosts } from '@services/BackendAPI/component'
import { Button } from 'antd'

interface FeedProps {
  feed: feedInterface
  handleFeedChange: HandleFeedChange['handleFeedChange']
}

export function Feed({ feed, handleFeedChange }: FeedProps): JSX.Element {
  const [isPrivateFeed, setIsPrivateFeed] = useState(true)
  const [pagination, setPagination] = useState(0)

  const switchFeed = (): void => {
    setIsPrivateFeed(!isPrivateFeed)
  }

  useEffect(() => {
    void (async () => {
      const allPosts = await getPosts('', isPrivateFeed, undefined, pagination)
      if (allPosts === null) return

      /* const newFeed = allPosts?.map((post) => {
        return { id: post.uuid, spotifyId: post.songId }
      }) */

      handleFeedChange({ posts: allPosts })
    })()
  }, [handleFeedChange, pagination, isPrivateFeed])
  return (
    <>
      <Button
        onClick={() => {
          setPagination(pagination + 1)
        }}
      >
        Fetch next 10
      </Button>
      <Button onClick={switchFeed}>Switch Feed (Global/Private)</Button>
      {feed.posts.map((post) => (
        <Post key={post.uuid} isFeed={true} postObject={post}></Post>
      ))}
    </>
  )
}

export function ProfileFeed(feed: feedInterface): JSX.Element {
  return (
    <>
      {feed.posts.map((post) => (
        <Post key={post.uuid} isFeed={false} postObject={post}></Post>
      ))}
    </>
  )
}

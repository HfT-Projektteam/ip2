// import { useEffect, useState } from 'react'

import { Post } from '@pages/Feed/Post'
import { type HandleFeedChange, type feedInterface } from './interface'
import { useEffect } from 'react'

// ToDo: Fetch Database
// eslint-disable-next-line @typescript-eslint/no-unused-vars
/* const [feedItems, setFeedItems] = useState(() => {
  const localValue = localStorage.getItem('ITEMS')
  if (localValue == null) return []

  return JSON.parse(localValue)
})

useEffect(() => {
  localStorage.setItem('ITEMS', JSON.stringify(feedItems))
}, [feedItems])
*/

interface FeedProps {
  feed: feedInterface
  handleFeedChange: HandleFeedChange['handleFeedChange']
}

const a: feedInterface = {
  posts: [
    { id: 'a', spotifyId: '' },
    { id: 'b', spotifyId: '' },
  ],
}

export function Feed({ feed, handleFeedChange }: FeedProps): JSX.Element {
  useEffect(() => {
    handleFeedChange(a)
  }, [])
  return (
    <>
      {feed.posts.map((post) => (
        <Post key={post.id} {...post}></Post>
      ))}
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

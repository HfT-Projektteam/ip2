// import { useEffect, useState } from 'react'

import { Post } from '@pages/Feed/Post'
import { type postInterface } from '@pages/Feed/Post/interface'
import crypto from 'crypto'

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

const posts: postInterface[] = [
  {
    key: crypto.randomUUID(),
    title: 'Hey Ben',
    artist: 'Hoodie Allen',
    album: 'Games we play',
    imgUrl:
      'https://images.unsplash.com/photo-1612999754243-3745bba6c302?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=734&q=80',
  },
  {
    key: crypto.randomUUID(),
    title: 'Happy',
    artist: 'Cro',
    album: 'test',
    imgUrl:
      'https://images.unsplash.com/photo-1620939123578-bb16277cfd54?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80',
  },
  {
    key: crypto.randomUUID(),
    title: 'Happy',
    artist: 'Cro',
    album: 'test',
    imgUrl:
      'https://images.unsplash.com/photo-1612999754243-3745bba6c302?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=734&q=80',
  },
]

export function Feed(): JSX.Element {
  return (
    <>
      {posts.map((post) => (
        <Post {...post}></Post>
      ))}
    </>
  )
}

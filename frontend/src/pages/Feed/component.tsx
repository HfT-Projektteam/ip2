// import { useEffect, useState } from 'react'

import { Post } from '@pages/Feed/Post'
import { type feedInterface } from './interface'

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

// const posts = postMock;

export function Feed(props: feedInterface): JSX.Element {
  return (
    <>
      {props.posts.map((post) => (
        <Post key={post.id} {...post}></Post>
      ))}
    </>
  )
}

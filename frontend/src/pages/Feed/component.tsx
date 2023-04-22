// import { useEffect, useState } from 'react'

import { Post } from '@pages/Feed/Post'
import postMock from '@data/mockdata/posts.json'

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

const posts = postMock;

export function Feed(): JSX.Element {
  return (
    <>
      {posts.map((post) => (
        <Post key={post.id}{...post}></Post>
      ))}
    </>
  )
}

import { useEffect, useState } from 'react'

export const helloWorld: string = 'Hello World'

// ToDo: Fetch Database
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const [feedItems, setFeedItems] = useState(() => {
  const localValue = localStorage.getItem('ITEMS')
  if (localValue == null) return []

  return JSON.parse(localValue)
})

useEffect(() => {
  localStorage.setItem('ITEMS', JSON.stringify(feedItems))
}, [feedItems])

export default function Feed (): JSX.Element {
  return (
    <>

    </>
  )
}

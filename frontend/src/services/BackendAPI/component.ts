import { type components as BackendComponents } from '@data/openapi'
type User = BackendComponents['schemas']['User']

const backendUri: string = process.env.REACT_APP_BACKEND_URI ?? ''

export async function getFollower(userId: string): Promise<User[] | null> {
  const options = {
    method: 'POST',
    headers: {},
  }

  return await request<User[]>(
    `${backendUri}/users/${userId}/follower`,
    options,
  )
    .then((user) => {
      return user
    })
    .catch((error) => {
      console.error('Error in getFollower:', error)
      return null
    })
}

async function request<T>(url: string, options: RequestInit): Promise<T> {
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return (await response.json()) as T
}

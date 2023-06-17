import { type components as BackendComponents } from '@data/openapi'
type User = BackendComponents['schemas']['UserDto']

const backendUri: string = process.env.REACT_APP_BACKEND_URI ?? ''

export async function getFollowers(userId: string): Promise<User[] | null> {
  const accessToken = localStorage.getItem('access_token') ?? ''

  if (accessToken === '' || userId == null) {
    return null
  }

  const options = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
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

export async function getFollowings(userId: string): Promise<User[] | null> {
  const accessToken = localStorage.getItem('access_token') ?? ''

  if (accessToken === '' || userId == null) {
    return null
  }

  const options = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  }

  return await request<User[]>(
    `${backendUri}/users/${userId}/followings`,
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

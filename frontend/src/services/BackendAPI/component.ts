import { type components as BackendComponents } from '@data/openapi'
type User = BackendComponents['schemas']['UserDto']

const backendUri: string = process.env.REACT_APP_BACKEND_URI ?? ''

export async function getFollowers(
  spotifyId: string,
  type: string,
  page: number,
): Promise<User[] | null> {
  const accessToken = localStorage.getItem('access_token') ?? ''

  if (accessToken === '' || spotifyId == null) {
    return null
  }

  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  }

  return await request<any>(
    `${backendUri}/users/${spotifyId}/${type}?page=${page}&take=10`,
    options,
  )
    .then((user) => {
      return user.data
    })
    .catch((error) => {
      console.error('Error in getFollower:', error)
      return null
    })
}

export async function getFollowersNum(spotifyId: string): Promise<number> {
  const accessToken = localStorage.getItem('access_token') ?? ''

  if (accessToken === '' || spotifyId == null || spotifyId === '') {
    return 0
  }

  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  }

  return await request<any>(
    `${backendUri}/users/${spotifyId}/follower?page=0&take=1`,
    options,
  )
    .then((user) => {
      return user.meta.itemCount
    })
    .catch((error) => {
      console.error('Error in getFollowersNum:', error)
      return 0
    })
}

export async function getFollowingsNum(spotifyId: string): Promise<number> {
  const accessToken = localStorage.getItem('access_token') ?? ''

  if (accessToken === '' || spotifyId == null || spotifyId === '') {
    return 0
  }

  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  }

  return await request<any>(
    `${backendUri}/users/${spotifyId}/followings?page=0&take=1`,
    options,
  )
    .then((user) => {
      return user.meta.itemCount
    })
    .catch((error) => {
      console.error('Error in getFollowingsNum:', error)
      return 0
    })
}

async function request<T>(url: string, options: RequestInit): Promise<T> {
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return (await response.json()) as T
}
